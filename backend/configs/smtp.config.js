const SMTPConfig = {
    // Optional: only set `service` if explicitly provided.
    // Defaulting to `gmail` can break setups like Brevo/SMTP relay.
    smtpService: process.env.SMTP_PROVIDER,
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFromAddress: process.env.SENDER_EMAIL,
}
export default SMTPConfig