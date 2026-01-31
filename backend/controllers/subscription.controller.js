import Subscription from '../models/subscription.model.js';

export const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({
                success: false,
                message: "Email is required"
            })
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.json({
                success: false,
                message: "Invalid email format"
            })
        }

        // Check if email already exists
        const existingSubscription = await Subscription.findOne({ email: email.toLowerCase() });

        if (existingSubscription) {
            if (existingSubscription.isActive) {
                return res.json({
                    success: false,
                    message: "Email already subscribed"
                })
            } else {
                // Reactivate subscription
                existingSubscription.isActive = true;
                await existingSubscription.save();
                return res.json({
                    success: true,
                    message: "Successfully resubscribed to newsletter"
                })
            }
        }

        // Create new subscription
        await Subscription.create({ email: email.toLowerCase() });

        res.json({
            success: true,
            message: "Successfully subscribed to newsletter"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

export const unsubscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({
                success: false,
                message: "Email is required"
            })
        }

        const subscription = await Subscription.findOne({ email: email.toLowerCase() });

        if (!subscription || !subscription.isActive) {
            return res.json({
                success: false,
                message: "Email not found or already unsubscribed"
            })
        }

        subscription.isActive = false;
        await subscription.save();

        res.json({
            success: true,
            message: "Successfully unsubscribed from newsletter"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

