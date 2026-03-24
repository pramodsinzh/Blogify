import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";

export const requireClerkAuth = async (req, res, next) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const user = await User.findById(userId).select("name email");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please sign in again.",
            });
        }

        req.authUser = {
            userId,
            name: user.name,
            email: user.email,
        };
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
