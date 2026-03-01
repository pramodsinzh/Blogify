import emailService from '../services/mailService.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const sendContactMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name?.trim()) {
            return res.json({ success: false, message: 'Name is required.' });
        }
        if (!email?.trim()) {
            return res.json({ success: false, message: 'Email is required.' });
        }
        if (!emailRegex.test(email)) {
            return res.json({ success: false, message: 'Invalid email format.' });
        }
        if (!message?.trim()) {
            return res.json({ success: false, message: 'Message is required.' });
        }

        const contactEmail = process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL;
        if (!contactEmail) {
            console.error('CONTACT_EMAIL or ADMIN_EMAIL not set in .env');
            return res.json({
                success: false,
                message: 'Contact form is not configured. Please try again later.',
            });
        }

        const subject = `Blogify Contact: ${name.trim()}`;
        const html = `
            <p><strong>From:</strong> ${name.trim()} &lt;${email.trim()}&gt;</p>
            <p><strong>Message:</strong></p>
            <p>${message.trim().replace(/\n/g, '<br>')}</p>
        `;

        await emailService.sendEmail({
            to: contactEmail,
            subject,
            message: html,
        });

        return res.json({
            success: true,
            message: 'Thanks for reaching out! We\'ll get back to you soon.',
        });
    } catch (error) {
        console.error('Contact form error:', error);
        return res.json({
            success: false,
            message: error?.message || 'Failed to send message. Please try again later.',
        });
    }
};
