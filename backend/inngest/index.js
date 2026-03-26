import { Inngest } from "inngest";
import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
import BlogNotification from "../models/blogNotification.model.js";
import emailService from "../services/mailService.js";

export const inngest = new Inngest({ id: "blog-post" });

const getNameFromClerkPayload = ({ first_name, last_name, email_addresses }) => {
    const fullName = `${first_name ?? ""} ${last_name ?? ""}`.trim();
    if (fullName) return fullName;
    return email_addresses?.[0]?.email_address ?? "User";
};

const syncUserCreation = inngest.createFunction(
    { id: "sync-user-from-clerk", triggers: { event: "clerk/user.created" } },
    async ({ event }) => {
        const { id, email_addresses, image_url, first_name, last_name } = event.data;
        const userData = {
            _id: id,
            name: getNameFromClerkPayload({ first_name, last_name, email_addresses }),
            email: email_addresses?.[0]?.email_address,
            image: image_url ?? "",
        };
        await User.findByIdAndUpdate(id, userData, { upsert: true, new: true });
    }
);

const syncUserUpdate = inngest.createFunction(
    { id: "update-user-from-clerk", triggers: { event: "clerk/user.updated" } },
    async ({ event }) => {
        const { id, email_addresses, image_url, first_name, last_name } = event.data;
        const userData = {
            _id: id,
            name: getNameFromClerkPayload({ first_name, last_name, email_addresses }),
            email: email_addresses?.[0]?.email_address,
            image: image_url ?? "",
        };
        await User.findByIdAndUpdate(id, userData, { upsert: true, new: true });
    }
);

const syncUserDeletion = inngest.createFunction(
    { id: "delete-user-with-clerk", triggers: { event: "clerk/user.deleted" } },
    async ({ event }) => {
        const { id } = event.data;
        await User.findByIdAndDelete(id);
    }
);

const sendBlogSubmissionForApproval = inngest.createFunction(
    { id: "send-blog-submission-for-approval", triggers: { event: "app/blog.submitted" } },
    async ({ event }) => {
        const { title, authorName, authorEmail, category } = event.data;
        await emailService.sendBlogApprovalRequest({
            blogTitle: title,
            authorName,
            authorEmail,
            category,
        });
    }
);

const sendNewBlogNotifications = inngest.createFunction(
    { id: "send-new-blog-notifications", triggers: { event: "app/blog.published" } },
    async ({ event, step }) => {
        const { blogId, blogTitle, blogSubTitle, blogCategory, blogImage } = event.data;
        const eventType = "app/blog.published";
        const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
        const blogURL = `${frontendURL}/blog/${blogId}`;

        const subscribers = await step.run("load-active-subscribers", async () => {
            return Subscription.find({ isActive: true }).select("email");
        });

        // Signed-in users are stored in the `User` collection via your Clerk sync functions.
        // These users should receive notifications even if they never subscribed to the newsletter.
        const users = await step.run("load-signed-in-users", async () => {
            return User.find({ email: { $exists: true, $ne: "" } }).select("email");
        });

        // Combine newsletter subscribers + signed-in users, dedupe by email (case-insensitive).
        const recipients = Array.from(
            new Map(
                [...(subscribers ?? []), ...(users ?? [])]
                    .filter((r) => r?.email)
                    .map((r) => {
                        const normalizedEmail = String(r.email).trim().toLowerCase();
                        return [normalizedEmail, { email: normalizedEmail }];
                    })
            ).values()
        );

        if (!recipients.length) {
            return {
                sent: 0,
                failed: 0,
                subscribersFound: subscribers.length,
                signedInUsersFound: users.length,
                recipientsFound: 0,
                blogId,
                blogTitle,
            };
        }

        // Idempotency: if this exact blog+recipient+event already succeeded, skip sending again.
        // This prevents double emails when Inngest retries or the event is emitted twice.
        const recipientEmails = recipients.map((r) => r.email);
        const alreadySent = await step.run("load-already-sent-notifications", async () => {
            return BlogNotification.find({
                blogId,
                eventType,
                email: { $in: recipientEmails },
            }).select("email");
        });
        const alreadySentSet = new Set(alreadySent.map((d) => d.email));

        const recipientsToSend = recipients.filter((r) => !alreadySentSet.has(r.email));
        const skippedAlreadySent = recipients.length - recipientsToSend.length;

        if (!recipientsToSend.length) {
            return {
                sent: 0,
                failed: 0,
                subscribersFound: subscribers.length,
                signedInUsersFound: users.length,
                recipientsFound: recipients.length,
                skippedAlreadySent,
                blogId,
                blogTitle,
            };
        }

        const results = await step.run("send-new-blog-emails", async () => {
            return Promise.allSettled(
                recipientsToSend.map((subscriber) =>
                    emailService
                        .sendEmail({
                            to: subscriber.email,
                            subject: `New Blog Published: ${blogTitle}`,
                            message: `
                                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                                    <h2>New Blog is Live!</h2>
                                    <p><strong>${blogTitle}</strong> has just been published.</p>
                                    ${blogSubTitle ? `<p>${blogSubTitle}</p>` : ""}
                                    ${blogCategory ? `<p><strong>Category:</strong> ${blogCategory}</p>` : ""}
                                    ${blogImage ? `<img src="${blogImage}" alt="${blogTitle}" style="max-width:100%;border-radius:8px;" />` : ""}
                                    <p style="margin-top:16px;"><a href="${blogURL}" target="_blank" rel="noopener noreferrer">Read the full blog</a></p>
                                </div>
                            `,
                        })
                        .catch((err) => {
                            // Attach the recipient so we can surface which emails failed.
                            if (err && typeof err === "object") err.recipientEmail = subscriber.email;
                            throw err;
                        })
                )
            );
        });

        const sent = results.filter((result) => result.status === "fulfilled").length;
        const failed = results.length - sent;
        const failedEntries = results
            .filter((result) => result.status === "rejected")
            .map((result) => ({
                recipientEmail: result.reason?.recipientEmail ?? null,
                message: result.reason?.message ?? null,
                details: result.reason?.details ?? null,
            }));

        // Record successful deliveries so future retries won't double-email.
        // allSettled preserves order with the input promises, so we can map back safely.
        const successfulRecipientEmails = results
            .map((r, idx) => (r.status === "fulfilled" ? recipientsToSend[idx].email : null))
            .filter((v) => v !== null);

        if (successfulRecipientEmails.length) {
            await step.run("record-sent-notifications", async () => {
                const docs = successfulRecipientEmails.map((email) => ({
                    blogId,
                    email,
                    eventType,
                }));
                try {
                    await BlogNotification.insertMany(docs, { ordered: false });
                } catch (err) {
                    // Ignore duplicates if concurrent runs insert the same record.
                    if (err && (err.code === 11000 || err.name === "MongoServerError")) return;
                    throw err;
                }
            });
        }

        return {
            sent,
            failed,
            subscribersFound: subscribers.length,
            signedInUsersFound: users.length,
            recipientsFound: recipients.length,
            skippedAlreadySent,
            failedEntries,
            blogId,
            blogTitle,
        };
    }
);

export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdate,
    sendBlogSubmissionForApproval,
    sendNewBlogNotifications,
];