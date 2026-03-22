import { Inngest } from "inngest";  
// import sendEmail from "../configs/nodeMailer.config.js";
import User from "../models/user.model.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "blog-post" });


//Inngest functions to manage user authentication and authorization
//create user
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk', triggers: { event: 'clerk/user.created' } },
    async ({ event }) => {
        const { id, email_addresses, image_url, first_name, last_name } = event.data;
        const userDate = {
            _id: id,
            name: `${first_name} ${last_name}`,
            email: email_addresses[0].email_address,
            image: image_url,
        }
        await User.create(userDate);
    }
)
//update user
const syncUserUpdate = inngest.createFunction(
    { id: 'update-user-from-clerk', triggers: { event: 'clerk/user.updated' } },
    async ({ event }) => {
        const { id, email_addresses, image_url, first_name, last_name } = event.data;
        const userDate = {
            _id: id,
            name: `${first_name} ${last_name}`,
            email: email_addresses[0].email_address,
            image: image_url,
        }
        await User.findByIdAndUpdate(id, userDate);
    }
)
//delete user
const syncUserDeletion = inngest.createFunction(
    { id: 'delete-user-with-clerk', triggers: { event: 'clerk/user.deleted' } },
    async ({ event }) => {
        const { id } = event.data;
        await User.findByIdAndDelete(id)
    }
)

 /**
//Inngest function to send approval email to the admin when user created a blog  
const sendBookingConfirmationEmail = inngest.createFunction(
    { id: 'send-booking-confirmation-email', triggers: { event: 'app/show.booked' } },
    async ({ event, step }) => {
        const { bookingId } = event.data;

        const booking = await Booking.findById(bookingId).populate({
            path: "show",
            populate: { path: "movie", model: "Movie" }
        }).populate("user");

        if (!booking) {
            console.log('send-booking-confirmation-email: booking not found', { bookingId });
            return;
        }

        await step.run('send-booking-confirmation-email', async () => {
            await sendEmail({
                to: booking.user.email,
                subject: `Payment Confirmation: "${booking.show.movie.title}" booked!`,
                body: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                  <h2>Hi ${booking.user.name || booking.user.email},</h2>
                  <p>Your booking for <strong style="color: #F84565;">${booking.show.movie.title}</strong> is confirmed.</p>
                  <p>
                    <strong>Date:</strong> ${new Date(booking.show.showDateTime).toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata' })}<br/>
                    <strong>Time:</strong> ${new Date(booking.show.showDateTime).toLocaleTimeString('en-US', { timeZone: 'Asia/Kathmandu' })}
                  </p>
                  <p>Please arrive 10 minutes before the show.</p>
                  <p>Enjoy the show!</p>
                  <p>Thanks for booking with us!<br/> ShowTimeX Team</p>
                </div>
            `
            })
        });
    }
)

 
//function to send notification when a new blog is posted 
const sendNewShowNotifications = inngest.createFunction(
    { id: 'send-new-show-notifications', triggers: { event: 'app/show.added' } },
    async ({ event, step }) => {
        const { movieTitle } = event.data;

        const users = await step.run('load-users-for-notification', async () => {
            return await User.find({ email: { $exists: true, $ne: "" } }).select("name email");
        });

        const tasks = users
            .filter(u => !!u.email)
            .map(u => ({
                userEmail: u.email,
                userName: u.name,
            }));

        if (tasks.length === 0) {
            return { sent: 0, failed: 0, skipped: 0, message: "No users with email found; nothing to notify." };
        }

        const results = await step.run('send-new-show-emails', async () => {
            return await Promise.allSettled(
                tasks.map(task =>
                    sendEmail({
                        to: task.userEmail,
                        subject: `🎬 New Show Added: ${movieTitle}`,
                        body: `
                <div style="font-family: sans-serif; max-width: 400px; margin: auto; background: #f7f7f7; padding: 32px 24px; border-radius: 12px; box-shadow: 0 2px 8px #0001;">
                    <h2 style="color: #23272F; margin-top: 0;">A New Show Has Been Added!</h2>
                    <p style="margin: 16px 0; font-size: 16px; color: #282828;">
                        Hello${task.userName ? ` ${task.userName}` : ''},
                    </p>
                    <p style="margin: 12px 0 24px; font-size: 16px; color: #323232;">
                        We're excited to let you know that <strong>${movieTitle}</strong> has just been added to our listings.
                    </p>
                    <p style="color: #878ea3; font-size: 14px; margin-bottom:0;">
                        Book your seat now and enjoy the show!
                    </p>
                </div>
            `,
                    })
                )
            );
        });

        const sent = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.length - sent;

        return { sent, failed, message: `New show notifications: ${sent} sent, ${failed} failed.` };
    }
)

*/
export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate];