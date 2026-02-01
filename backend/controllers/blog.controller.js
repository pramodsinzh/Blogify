import fs from 'fs'
import imagekit from '../configs/imageKit.config.js';
import Blog from '../models/blog.model.js';
import Comment from '../models/comment.model.js';
import main from '../configs/gemini.config.js';
import { notifySubscribersAboutNewBlog } from '../services/notificationService.js';
import mongoose from "mongoose";

/**
 * Send email notifications for a newly published blog.
 * Non-blocking; does not throw.
 */
function notifyNewBlogPublished(blog) {
    const payload = {
        id: blog._id,
        title: blog.title,
        subTitle: blog.subTitle,
        category: blog.category,
        image: blog.image,
        createdAt: blog.createdAt
    };
    const frontendURL = process.env.FRONTEND_URL || 'http://localhost:5173';
    notifySubscribersAboutNewBlog(payload, frontendURL).catch(error => {
        console.error('Error sending email notifications:', error);
    });
}

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
        const imageKitFileId = response.fileId;

        const newBlog = await Blog.create({ title, subTitle, description, category, image, imageKitFileId, isPublished })

        if (isPublished) {
            notifyNewBlogPublished(newBlog);
        }

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
            blogs: blogs
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
            blog: blog
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
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.json({
                success: false,
                message: "Blog not found"
            });
        }

        // Delete image from ImageKit if we have the file ID
        if (blog.imageKitFileId) {
            try {
                await imagekit.files.delete(blog.imageKitFileId);
            } catch (imageKitError) {
                // Log but don't fail the request - blog may have been created before we stored fileId
                console.error("ImageKit delete failed:", imageKitError.message);
            }
        }

        await Blog.findByIdAndDelete(id);

        //Delete comments associated with this blog
        await Comment.deleteMany({ blog: id });

        res.json({
            success: true,
            message: "Blog deleted successfully!"
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
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

        if (updatedBlog.isPublished && !currentStatus) {
            notifyNewBlogPublished(updatedBlog);
        }

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

export const addComment = async (req, res) => {
    try {
        const { blog, name, content } = req.body;
        const comment = await Comment.create({ blog, name, content });
        res.json({
            success: true,
            message: "Comment added for review",
            data: comment
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

export const getBlogComments = async (req, res) => {
    try {
        const { blogId } = req.query;

        if (!blogId) {
            return res.status(400).json({
                success: false,
                message: "blogId query parameter is required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(blogId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid blog ID"
            });
        }

        const comments = await Comment.find({
            blog: new mongoose.Types.ObjectId(blogId),
            isApproved: true
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            comments
        });
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body;
        const content = await main(prompt + '. Generate a well-structured blog post in markdown format with proper headings (using # for main title, ## for section headings), paragraphs, and bullet points. Make it professional and engaging.')
        res.json({ success: true, content })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}