const SMTPConfig = {
    smtpService: process.env.SMTP_PROVIDER ?? 'gmail', //optional
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPassword: process.env.SMTP_PASSWORD,
    smtpFromAddress: process.env.SMTP_FROM,
}
export default SMTPConfig