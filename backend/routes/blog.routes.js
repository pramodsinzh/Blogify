import express from 'express'
import { addBlog } from '../controllers/blog.controller.js';
import upload from '../middleware/multer.middleware.js';

const blogRouter = express.Router();

blogRouter.post("/add", upload.single('image'), addBlog)