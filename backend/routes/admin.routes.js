import express from 'express'
import { adminLogin } from '../controllers/admin.controller.js';

const adminRouter = express.Router();
 
adminRouter.post("/login", adminLogin);

export default adminRouter;

