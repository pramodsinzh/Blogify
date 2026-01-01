import express from 'express'
import { addBlog } from '../controllers/blog.controller.js';

const blogRouter = express.Router();

blogRouter.post("/add", addBlog)