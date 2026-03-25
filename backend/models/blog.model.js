import mongoose from "mongoose";


const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subTitle: { type: String },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    imageKitFileId: { type: String }, // ImageKit file ID for deletion when blog is removed
    authorName: { type: String, required: true, trim: true },
    authorId: { type: String, required: true, trim: true },
    authorEmail: { type: String, trim: true, lowercase: true },
    isPublished: { type: Boolean, default: false, required: true },
    status: {
        type: String,
        enum: ["pending", "published", "rejected", "draft"],
        default: "pending",
        required: true
    },
    submittedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
}, {
    timestamps: true
})

const Blog = mongoose.model("blog", blogSchema);

export default Blog;