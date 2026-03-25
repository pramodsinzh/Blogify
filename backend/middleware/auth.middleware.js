import jwt from "jsonwebtoken";
import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";

const auth = async (req, res, next)=> {
    try {
        // 1) Try legacy JWT auth first (for backward compatibility)
        const authHeader = req.headers.authorization;
        if (authHeader?.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            try {
                jwt.verify(token, process.env.JWT_SECRET);
                return next();
            } catch {
                // Continue and try Clerk-based admin auth
            }
        }

        // 2) Clerk admin auth
        const { userId } = getAuth(req);
        if (!userId) {
            return res.json({
                success: false,
                message: 'Invalid Token'
            });
        }

        const user = await User.findById(userId).select("email");
        const userEmail = user?.email?.toLowerCase()?.trim();
        const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase()?.trim();

        if (userEmail && adminEmail && userEmail === adminEmail) {
            return next();
        }

        return res.json({
            success: false,
            message: 'Invalid Token'
        });
    } catch (error) {
        return res.json({
            success: false,
            message: 'Invalid Token'
        })
    }
}

export default auth;