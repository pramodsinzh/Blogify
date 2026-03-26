import mongoose from "mongoose";

const blogNotificationSchema = new mongoose.Schema(
    {
        blogId: { type: String, required: true, index: true },
        email: { type: String, required: true, lowercase: true, trim: true, index: true },
        eventType: { type: String, required: true, index: true },
    },
    {
        timestamps: true,
    }
);

// Ensure we never send the same notification twice for the same blog+recipient+event.
blogNotificationSchema.index({ blogId: 1, email: 1, eventType: 1 }, { unique: true });

const BlogNotification = mongoose.model("BlogNotification", blogNotificationSchema);
export default BlogNotification;

