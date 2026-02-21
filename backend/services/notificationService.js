import emailService from './mailService.js';
import Subscription from '../models/subscription.model.js';

/**
 * Send email notifications to all active subscribers about a new blog post
 * @param {Object} blogData - Blog data object containing blog information
 * @param {string} frontendURL - Frontend URL for blog links
 */
export const notifySubscribersAboutNewBlog = async (blogData, frontendURL = 'http://localhost:5173') => {
    try {
        // Get all active subscribers
        const subscribers = await Subscription.find({ isActive: true });
        
        if (subscribers.length === 0) {
            console.log('No active subscribers to notify');
            return { success: true, notified: 0 };
        }

        const blogURL = `${frontendURL}/blog/${blogData.id}`;
        
        // Create HTML email template
        const emailHTML = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                        line-height: 1.6;
                        color: #333;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #f4f4f4;
                    }
                    .container {
                        background-color: #ffffff;
                        border-radius: 8px;
                        padding: 30px;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #e0e0e0;
                    }
                    .header h1 {
                        color: #2563eb;
                        margin: 0;
                        font-size: 28px;
                    }
                    .blog-image {
                        width: 100%;
                        max-width: 100%;
                        height: auto;
                        border-radius: 8px;
                        margin: 20px 0;
                    }
                    .blog-title {
                        font-size: 24px;
                        font-weight: bold;
                        color: #1f2937;
                        margin: 20px 0 10px 0;
                    }
                    .blog-subtitle {
                        font-size: 18px;
                        color: #6b7280;
                        margin-bottom: 15px;
                        font-style: italic;
                    }
                    .blog-category {
                        display: inline-block;
                        background-color: #2563eb;
                        color: #ffffff;
                        padding: 5px 15px;
                        border-radius: 20px;
                        font-size: 14px;
                        margin-bottom: 20px;
                    }
                    .cta-button {
                        display: inline-block;
                        background-color: #2563eb;
                        color: #ffffff !important;
                        padding: 12px 30px;
                        text-decoration: none;
                        border-radius: 6px;
                        font-weight: 600;
                        margin: 20px 0;
                        text-align: center;
                    }
                    .cta-button:hover {
                        background-color: #1d4ed8;
                    }
                    .footer {
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #e0e0e0;
                        text-align: center;
                        color: #6b7280;
                        font-size: 14px;
                    }
                    .unsubscribe-link {
                        color: #6b7280;
                        text-decoration: none;
                        font-size: 12px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📝 New Blog Post!</h1>
                    </div>
                    
                    <div class="blog-category">${blogData.category || 'Blog'}</div>
                    
                    ${blogData.image ? `<img src="${blogData.image}" alt="${blogData.title}" class="blog-image" />` : ''}
                    
                    <h2 class="blog-title">${blogData.title || 'New Blog Post'}</h2>
                    
                    ${blogData.subTitle ? `<p class="blog-subtitle">${blogData.subTitle}</p>` : ''}
                    
                    <p style="color: #4b5563; margin: 20px 0;">
                        We're excited to share our latest blog post with you! Check it out and let us know what you think.
                    </p>
                    
                    <div style="text-align: center;">
                        <a href="${blogURL}" class="cta-button">Read Full Blog</a>
                    </div>
                    
                    <div class="footer">
                        <p>Thank you for subscribing to our newsletter!</p>
                        <p style="font-size: 12px; color: #9ca3af;">
                            You're receiving this email because you subscribed to our newsletter.
                            <br>
                            <a href="${frontendURL}" class="unsubscribe-link">Unsubscribe</a> | 
                            <a href="${frontendURL}" class="unsubscribe-link">Visit Blogify</a>
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Send emails to all subscribers
        const emailPromises = subscribers.map(subscriber => 
            emailService.sendEmail({
                to: subscriber.email,
                subject: `New Blog Post: ${blogData.title || 'Check out our latest blog!'}`,
                message: emailHTML
            }).catch(error => {
                console.error(`Failed to send email to ${subscriber.email}:`, error.message);
                return { success: false, email: subscriber.email, error: error.message };
            })
        );

        // Wait for all emails to be sent (or fail)
        const results = await Promise.allSettled(emailPromises);
        
        const successful = results.filter(r => r.status === 'fulfilled' && r.value?.messageId).length;
        const failed = results.length - successful;

        console.log(`Email notifications sent: ${successful} successful, ${failed} failed`);

        return {
            success: true,
            notified: successful,
            failed: failed,
            total: subscribers.length
        };

    } catch (error) {
        console.error('Error sending email notifications:', error);
        return {
            success: false,
            error: error.message
        };
    }
};
