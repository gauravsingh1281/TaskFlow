import User from "../models/user.model.js";
import { verifyToken } from "../utils/jwt.utils.js";

const authenticateUser = async (req, res, next) => {
    try {
        const token =
            req.headers.authorization?.split(" ")[1] ||
            req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: No token provided",
            });
        }

        const decoded = verifyToken(token);

        req.user = await User.findById(decoded.id).select("-password");

        if (!req.user) {
            return res.status(401).json({ message: "User not found" });
        }
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized: Invalid or expired token",
        });
    }
};

export default authenticateUser;
