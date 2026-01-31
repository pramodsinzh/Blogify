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
                    pass: SMTPConfig.smtpPassword
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
}

// Create and export a singleton instance
const emailService = new EmailService();
export default emailService;