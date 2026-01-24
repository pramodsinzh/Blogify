import express from 'express'
import { adminLogin, approveCommentById, deleteCommentById, getAllBlogsAdmin, getAllComments, getDashboard } from '../controllers/admin.controller.js';
import auth from '../middleware/auth.middleware.js';

const adminRouter = express.Router();
 
adminRouter.post("/login", adminLogin);
adminRouter.get("/dashboard", auth, getDashboard);
adminRouter.get("/blogs", auth, getAllBlogsAdmin);
adminRouter.get("/comments", auth, getAllComments);
adminRouter.delete("/delete-comment", auth, deleteCommentById);
adminRouter.post("/approve-comment", auth, approveCommentById);

export default adminRouter;

