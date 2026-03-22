import { Inngest } from "inngest"; 
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import sendEmail from "../configs/nodeMailer.config.js";
import User from "../models/user.model.js";

// Create a client to send and receive events
export const inngest = new Inngest({ id: "blog-post" });


//Inngest functions to manage user authentication and authorization
//create user
const syncUserCreation = inngest.createFunction(
    { id: 'sync-user-from-clerk' },
    { event: 'clerk/user.created' },
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
    { id: 'update-user-from-clerk' },
    { event: 'clerk/user.updated' },
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
    { id: 'delete-user-with-clerk' },
    { event: 'clerk/user.deleted' },
    async ({ event }) => {
        const { id } = event.data;
        await User.findByIdAndDelete(id)
    }
)

//function to cancel booking and release seats of show after 10 minutes of booking created if payment is not done
const releaseSeatsandDeleteBooking = inngest.createFunction(
    { id: 'release-seats-delete-booking' },
    { event: 'app/checkpayment' },
    async ({ event, step }) => {
        const bookingId = event.data.bookingId;

        // If payment is already completed when this function starts, exit early.
        const existingBooking = await Booking.findById(bookingId);
        if (!existingBooking || existingBooking.isPaid) {
            return;
        }

        const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
        await step.sleepUntil('wait-for-10-minutes', tenMinutesLater);

        await step.run('check-payment-status', async () => {
            const booking = await Booking.findById(bookingId);

            // If booking is missing or already paid by the time we check, do nothing.
            if (!booking || booking.isPaid) {
                return;
            }

            const show = await Show.findById(booking.show);
            booking.bookedSeats.forEach((seat) => {
                delete show.occupiedSeats[seat];
            });
            show.markModified('occupiedSeats');
            await show.save();
            await Booking.findByIdAndDelete(booking._id);
        });
    }
)

//Inngest function to send email when user books a show
const sendBookingConfirmationEmail = inngest.createFunction(
    { id: 'send-booking-confirmation-email' },
    { event: 'app/show.booked' },
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

//Inngest function to send reminder email to the user 8 hrs before the show starts
const sendShowReminders = inngest.createFunction(
    { id: 'send-show-reminders' },
    { cron: '0 */8 * * *' }, //run every 8 hours
    async ({ step }) => {
        const now = new Date();
        const in8hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
        const windowStart = new Date(in8hours.getTime() - 10 * 60 * 1000);

        //prepare reminder tasks
        const reminderTasks = await step.run('prepare-reminder-tasks', async () => {
            const shows = await Show.find({
                showTime: { $gte: windowStart, $lte: in8hours },
            }).populate('movie')

            const tasks = []

            for (const show of shows) {
                if (!show.movie || !show.occupiedSeats) continue;

                const userIds = [...new Set(Object.values(show.occupiedSeats))]
                if (userIds.length === 0) continue;

                const users = await User.find({ _id: { $in: userIds } }).select("name email")

                for (const user of users) {
                    tasks.push({
                        userEmail: user.email,
                        userName: user.name,
                        movieTitle: show.movie.title,
                        showTime: show.showTime
                    })
                }
            }
            return tasks;
        })
        if (reminderTasks.length === 0) {
            return { sent: 0, message: "No remianders to send!" }
        }

        //send reminder emails
        const results = await step.run('send-all-reminders', async () => {
            return await Promise.allSettled(
                reminderTasks.map(task => sendEmail({
                    to: task.userEmail,
                    subject: `🎬 Movie Reminder: "${task.movieTitle}" starts soon!`,
                    body: `
                        <div style="font-family: sans-serif; max-width: 400px; margin: auto; background: #f7f7f7; padding: 32px 24px; border-radius: 12px; box-shadow: 0 2px 8px #0001;">
                            <h2 style="color: #23272F; margin-top: 0;">Your Movie Night Awaits!</h2>
                            <p style="margin: 16px 0; font-size: 16px; color: #282828;">
                                Hi ${task.userName || ''},
                            </p>
                            <p style="margin: 12px 0 24px; font-size: 16px; color: #323232;">
                                This is a friendly reminder that <strong>${task.movieTitle}</strong> starts at <strong>${new Date(task.showTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</strong>.
                            </p>
                            <p style="color: #878ea3; font-size: 14px; margin-bottom:0;">
                                Enjoy your show!
                            </p>
                        </div>
                    `
                }))
            )
        })

        const sent = results.filter(r => r.status === 'fulfilled').length;
        const failed = results.length - sent;

        return {
            sent, failed, message: `Sent ${sent} reminder(s), ${failed} failed!`
        }
    }
)

//function to send notification when a new show is added 
const sendNewShowNotifications = inngest.createFunction(
    { id: 'send-new-show-notifications' },
    { event: 'app/show.added' },
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

export const functions = [syncUserCreation, syncUserDeletion, syncUserUpdate];