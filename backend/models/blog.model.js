import mongoose from "mongoose";


const blogSchema = new mongoose.Schema({
    title: { type: String, require: true},
    subTitle: { type: String},
    description: { type: String, require: true},
    category: { type: String, require: true},
    image: { type: String, require: true},
    imageKitFileId: { type: String }, // ImageKit file ID for deletion when blog is removed
    isPublished: { type: Boolean, default: false, required: true},
}, {
    timestamps: true
})

const Blog = mongoose.model("blog", blogSchema);

export default Blog;