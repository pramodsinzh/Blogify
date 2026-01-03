import express from 'express'
import { addBlog, deleteBlogById, getAllBlogs, getBlogById, togglePublish } from '../controllers/blog.controller.js';
import upload from '../middleware/multer.middleware.js';
import auth from '../middleware/auth.middleware.js';

const blogRouter = express.Router();

blogRouter.post("/add", upload.single('image'), auth, addBlog)
blogRouter.get("/all", getAllBlogs)
blogRouter.get("/:blogId", getBlogById)
blogRouter.post("/delete", auth, deleteBlogById)
blogRouter.post("/toggle-publish", auth, togglePublish)

export default blogRouter;