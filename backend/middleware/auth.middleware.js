import jwt from "jsonwebtoken";

const auth = (req, res, next)=> {
    try {
        // Extract token from Authorization header
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.json({
                success: false,
                message: 'Invalid Token'
            });
        }
        
        const token = authHeader.split(' ')[1]; // Get token after 'Bearer '
        
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.json({
            success: false,
            message: 'Invalid Token'
        })
    }
}

export default auth;