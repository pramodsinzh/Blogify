import nodemailer from 'nodemailer' 
import SMTPConfig from '../configs/smtp.config.js';

class EmailService {
    #transport;

    constructor() {
        try {
            this.#transport = nodemailer.createTransport({
                host: SMTPConfig.smtpHost,
                port: SMTPConfig.smtpPort,
                service: SMTPConfig.smtpService, //optional
                auth: {
                    user: SMTPConfig.smtpUser,
                    pass: SMTPConfig.smtpPass
                }
            });
            console.log("SMTP server connected successfully.");
        } catch (exception) {
            //console.log(exception);
            throw { code: 500, message: "SMTP not connected...", status: "SMTP_SERVER_CONNECTION_ERROR" };
        }
    }

    async sendEmail({ to, subject, message, cc = null, bcc = null, attachments = null }) {
        try {
            let messageBody = {
                to: to,
                from: SMTPConfig.smtpFromAddress,
                subject: subject,
                html: message,
            };

            if (cc) {
                messageBody['cc'] = cc;
            }
            if (bcc) {
                messageBody['bcc'] = bcc;
            }
            if (attachments) {
                messageBody['attachments'] = attachments;
            }

            const result = await this.#transport.sendMail(messageBody);
            return result;
        } catch (exception) {
            console.log(exception);
            throw { code: 500, message: "Email sending failed...", status: "EMAIL_SENDING_FAILED" };
        }
    }

    async sendBlogApprovalRequest({ blogTitle, authorName, authorEmail, category }) {
        const adminEmail = process.env.ADMIN_EMAIL;
        if (!adminEmail) return null;

        return this.sendEmail({
            to: adminEmail,
            subject: `Blog Approval Required: ${blogTitle}`,
            message: `
                <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h2>New blog submitted for review</h2>
                    <p>A new blog has been submitted and is waiting for admin review.</p>
                    <ul>
                        <li><strong>Title:</strong> ${blogTitle}</li>
                        <li><strong>Author:</strong> ${authorName}</li>
                        <li><strong>Email:</strong> ${authorEmail || "N/A"}</li>
                        <li><strong>Category:</strong> ${category}</li>
                    </ul>
                    <p>Please review and publish it from the admin dashboard.</p>
                </div>
            `
        });
    }
}

// Create and export a singleton instance
const emailService = new EmailService();
export default emailService;