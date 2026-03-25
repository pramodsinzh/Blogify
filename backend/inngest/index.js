import { Inngest } from "inngest";
import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
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
        const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";
        const blogURL = `${frontendURL}/blog/${blogId}`;

        const subscribers = await step.run("load-active-subscribers", async () => {
            return Subscription.find({ isActive: true }).select("email");
        });

        if (!subscribers.length) {
            return { sent: 0, failed: 0 };
        }

        const results = await step.run("send-new-blog-emails", async () => {
            return Promise.allSettled(
                subscribers.map((subscriber) =>
                    emailService.sendEmail({
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
                        `
                    })
                )
            );
        });

        const sent = results.filter((result) => result.status === "fulfilled").length;
        const failed = results.length - sent;
        return { sent, failed };
    }
);

export const functions = [
    syncUserCreation,
    syncUserDeletion,
    syncUserUpdate,
    sendBlogSubmissionForApproval,
    sendNewBlogNotifications,
];