import jwt from 'jsonwebtoken'
import Blog from '../models/blog.model.js';
import Comment from '../models/comment.model.js';
import Subscription from '../models/subscription.model.js';

export const adminLogin = async (req, res)=> {
    try {
        const {email, password} = req.body;
        if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD){
            return res.json({
                success: false,
                message: "Invalid Crediantials"
            })
        }
        const token = jwt.sign({email}, process.env.JWT_SECRET)
        res.json({
            success: true,
            token
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}
export const getAllBlogsAdmin = async (req, res)=>{
    try {
        const blogs = await Blog.find({}).sort({createdAt: -1})
        res.json({
            success: true,
            blogs
        })
    } catch (error) {
         res.json({
            success: false,
            message: error.message
        })
    }
}
export const getAllComments = async (req, res)=>{
    try {
        const comments = await Comment.find({}).populate("blog").sort({createdAt: -1})
        res.json({
            success: true,
            comments: comments
        })
    } catch (error) {
         res.json({
            success: false,
            message: error.message
        })
    }
}
export const getDashboard = async (req, res)=>{
    try {
        const recentBlogs = await Blog.find({}).sort({createdAt: -1}).limit(5);
        const blogs = await Blog.countDocuments();
        const comments = await Comment.countDocuments();
        const drafts = await Blog.countDocuments({isPublished: false});

        const dashboardData = {
            blogs, comments, drafts, recentBlogs
        }
        res.json({
            success: true,
            dashboardData
        })
    } catch (error) {
         res.json({
            success: false,
            message: error.message
        })
    }
}
export const deleteCommentById = async (req, res)=>{
    try {
         const {id} = req.body;
         await Comment.findByIdAndDelete(id)
        res.json({
            success: true,
            message: "Comment deleted successfully!"
        })
    } catch (error) {
         res.json({
            success: false,
            message: error.message
        })
    }
}
export const approveCommentById = async (req, res)=>{
    try {
         const {id} = req.body;

         if (!id) {
            return res.status(400).json({
                success: false,
                message: "Comment id is required"
            });
         }

         const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { isApproved: true },
            { new: true }
         );

         if (!updatedComment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
         }

        res.json({
            success: true,
            message: "Comment approved successfully!",
            data: updatedComment
        })
    } catch (error) {
         res.json({
            success: false,
            message: error.message
        })
    }
}

export const getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ isActive: true });
        res.json({
            success: true,
            count: subscriptions.length,
            subscriptions: subscriptions
        })
    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

export const deleteSubscriber = async (req, res) => {
    try {
        const {id} = req.body;
        const subscriber = await Subscription.findById(id)
        if(!subscriber) {
            return res.json({
                success: false,
                message: "Subscriber not found!"
            })
        }
        await Subscription.findByIdAndDelete(id)
        return res.json({
            success: true,
            message: "Subscriber removed successfully!"
        })
    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        })
    }
}

