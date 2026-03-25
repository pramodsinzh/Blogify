const SMTPConfig = {
    smtpService: process.env.SMTP_PROVIDER ?? 'gmail', //optional
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFromAddress: process.env.SENDER_EMAIL,
}
export default SMTPConfig