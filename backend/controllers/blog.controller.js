import fs from 'fs'
import imagekit from '../configs/imageKit.config.js';
import Blog from '../models/blog.model.js';
import Comment from '../models/comment.model.js';
import main from '../configs/gemini.config.js';
import mongoose from "mongoose";
import { inngest } from "../inngest/index.js";

const queueBlogSubmissionApprovalEmail = async (blog) => {
    await inngest.send({
        name: "app/blog.submitted",
        data: {
            blogId: blog._id.toString(),
            title: blog.title,
            authorName: blog.authorName,
            authorEmail: blog.authorEmail,
            category: blog.category,
        },
    });
};

const queueNewBlogPublishedEmail = async (blog) => {
    await inngest.send({
        name: "app/blog.published",
        data: {
            blogId: blog._id.toString(),
            blogTitle: blog.title,
            blogSubTitle: blog.subTitle,
            blogCategory: blog.category,
            blogImage: blog.image,
        },
    });
};

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

        const isUserSubmission = Boolean(req.authUser?.userId);
        const shouldPublish = Boolean(isPublished) && !isUserSubmission;
        const status = shouldPublish ? "published" : (isUserSubmission ? "pending" : "draft");
        const authorName = isUserSubmission ? req.authUser.name : "Admin";
        const authorId = isUserSubmission ? req.authUser.userId : "admin";
        const authorEmail = isUserSubmission ? req.authUser.email : process.env.ADMIN_EMAIL;

        const newBlog = await Blog.create({
            title,
            subTitle,
            description,
            category,
            image,
            imageKitFileId,
            isPublished: shouldPublish,
            status,
            authorName,
            authorId,
            authorEmail,
            submittedAt: new Date(),
            reviewedAt: shouldPublish ? new Date() : undefined,
        });

        if (isUserSubmission) {
            await queueBlogSubmissionApprovalEmail(newBlog);
        } else if (shouldPublish) {
            await queueNewBlogPublishedEmail(newBlog);
        }

        res.json({
            success: true,
            message: isUserSubmission
                ? "Blog submitted for admin approval"
                : "Blog added successfully"
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
        if (!blog.isPublished) {
            return res.status(403).json({
                success: false,
                message: "This blog is not published yet",
            });
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
        const willBePublished = !currentStatus;
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            {
                isPublished: willBePublished,
                status: willBePublished ? "published" : "draft",
                reviewedAt: new Date(),
            },
            { new: true } // Return the updated document
        );

        if (updatedBlog.isPublished && !currentStatus) {
            await queueNewBlogPublishedEmail(updatedBlog);
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

export const reviewBlogById = async (req, res) => {
    try {
        const { id, action } = req.body;

        if (!id || !["approve", "reject"].includes(action)) {
            return res.status(400).json({
                success: false,
                message: "Valid blog id and action are required",
            });
        }

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }

        if (action === "approve") {
            const updatedBlog = await Blog.findByIdAndUpdate(
                id,
                {
                    isPublished: true,
                    status: "published",
                    reviewedAt: new Date(),
                },
                { new: true }
            );

            await queueNewBlogPublishedEmail(updatedBlog);

            return res.json({
                success: true,
                message: "Blog approved and published successfully",
                data: updatedBlog,
            });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            {
                isPublished: false,
                status: "rejected",
                reviewedAt: new Date(),
            },
            { new: true }
        );

        return res.json({
            success: true,
            message: "Blog rejected successfully",
            data: updatedBlog,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getMyBlogs = async (req, res) => {
    try {
        const userId = req.authUser?.userId;
        const blogs = await Blog.find({ authorId: userId }).sort({ createdAt: -1 });
        return res.json({
            success: true,
            blogs,
        });
    } catch (error) {
        return res.json({
            success: false,
            message: error.message,
        });
    }
};

export const addComment = async (req, res) => {
    try {
        const { blog, content } = req.body;
        const name = req.authUser?.name;

        if (!blog || !content || !name) {
            return res.status(400).json({
                success: false,
                message: "Blog, comment content, and authenticated user are required",
            });
        }

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