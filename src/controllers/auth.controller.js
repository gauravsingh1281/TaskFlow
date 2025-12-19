import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.utils.js";

export const register = async (req, res) => {
    const { fullName, email, password, role, mobileNo } = req.body;

    try {
        const isUserAlreadyExists = await User.findOne({
            $or: [{ email }, { mobileNo }],
        }).lean();

        if (isUserAlreadyExists) {
            return res.status(409).json({ message: "User already exists." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            fullName,
            email,
            mobileNo,
            role,
            password: hashedPassword,
        });

        // Generate token
        const token = generateToken({ id: newUser._id });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully.",
            data: {
                userId: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                mobileNo: newUser.mobileNo,
                role: newUser.role,
            },
        });
    } catch (error) {
        console.log("Error in register controller:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};

export const login = async (req, res) => {
    const { email, mobileNo, password } = req.body;

    try {
        const userExists = await User.findOne({
            $or: [{ email }, { mobileNo }],
        });

        if (!userExists) {
            return res.status(404).json({ message: "Invalid credentials." });
        }

        const validPassword = await bcrypt.compare(password, userExists.password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid credentials." });
        }

        const token = generateToken({ id: userExists._id });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully.",
            data: {
                userId: userExists._id,
                fullName: userExists.fullName,
                email: userExists.email,
                mobileNo: userExists.mobileNo,
                role: userExists.role,
            },
        });
    } catch (error) {
        console.log("Error in login controller:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};


export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully.",
        });
    } catch (error) {
        console.log("Error in logout controller:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};
