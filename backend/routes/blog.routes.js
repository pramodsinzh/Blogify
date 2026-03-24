import express from 'express'
import { addBlog, addComment, deleteBlogById, generateContent, getAllBlogs, getBlogById, getBlogComments, getMyBlogs, reviewBlogById, togglePublish } from '../controllers/blog.controller.js';
import upload from '../middleware/multer.middleware.js';
import auth from '../middleware/auth.middleware.js';
import { requireClerkAuth } from '../middleware/clerkAuth.middleware.js';

const blogRouter = express.Router();

blogRouter.post("/add", upload.single('image'), auth, addBlog)
blogRouter.post("/add-user", upload.single('image'), requireClerkAuth, addBlog)
blogRouter.get("/all", getAllBlogs)
blogRouter.get("/my-blogs", requireClerkAuth, getMyBlogs)
blogRouter.delete("/delete", auth, deleteBlogById)
blogRouter.post("/toggle-publish", auth, togglePublish)
blogRouter.post("/review", auth, reviewBlogById)

blogRouter.post('/add-comment', requireClerkAuth, addComment)
blogRouter.get('/comments', getBlogComments)
blogRouter.get("/:blogId", getBlogById)
blogRouter.post('/generate', auth, generateContent)

export default blogRouter;