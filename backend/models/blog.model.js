import mongoose from "mongoose";


const blogSchema = new mongoose.Schema({
    title: { type: String, require: true},
    subTitle: { type: String},
    description: { type: String, require: true},
    category: { type: String, require: true},
    image: { type: String, require: true},
    isPublished: { type: String, require: true},
}, {
    timestamps: true
})

const Blog = mongoose.model("blog", blogSchema);

export default Blog;