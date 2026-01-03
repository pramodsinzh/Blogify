import fs from 'fs'
import imagekit from '../configs/imageKit.config.js';
import Blog from '../models/blog.model.js';

export const addBlog = async (req, res) => {
    try {
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);
        const imageFile = req.file;

        // Check if all fields are present
        if (!title || !description || !category || !imageFile) {
            return res.json({
                success: false,
                message: "Missing required fields"
            })
        }
        // Create a read stream from the file
        const fileStream = fs.createReadStream(imageFile.path)

        //Upload Image to ImageKit
        const response = await imagekit.files.upload({
            file: fileStream,
            fileName: imageFile.originalname,
            folder: "/blogs"
        })

        // Construct optimized URL with transformations
        // ImageKit transformations are applied via URL parameters
        const optimizedImageUrl = response.url ? `${response.url}?tr=w-1280,q-auto,f-webp` : response.url;

        const image = optimizedImageUrl;

        await Blog.create({ title, subTitle, description, category, image, isPublished })
        res.json({
            success: true,
            message: "Blog added successfully"
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true })
        res.json({
            success: true,
            message: blogs
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId)
        if (!blog) {
            return res.json({
                success: false,
                message: "Blog not found"
            })
        }
        res.json({
            success: true,
            message: blog
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}
export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.body;
        await Blog.findByIdAndDelete(id)
        res.json({
            success: true,
            message: "Blog deleted successfully!"
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}
export const togglePublish = async (req, res) => {
    try {
        const { id } = req.body;
        
        if (!id) {
            return res.json({
                success: false,
                message: "Blog ID is required"
            })
        }
        
        // First get the current blog to check if it exists and get current status
        const currentBlog = await Blog.findById(id);
        
        if (!currentBlog) {
            return res.json({
                success: false,
                message: "Blog not found"
            })
        }
        
        // Convert to boolean if it's stored as string (for backward compatibility)
        const currentStatus = currentBlog.isPublished === true || currentBlog.isPublished === 'true';
        
        // Toggle the isPublished status
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { isPublished: !currentStatus },
            { new: true } // Return the updated document
        );
        
        res.json({
            success: true,
            message: `Blog ${updatedBlog.isPublished ? 'published' : 'unpublished'} successfully!`,
            data: updatedBlog
        })

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}
