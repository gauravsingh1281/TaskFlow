import User from "../models/user.model.js";

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.log("Error in getAllUsers:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};


export const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully.",
        });
    } catch (error) {
        console.log("Error in deleteUser:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};



export const searchUsers = async (req, res) => {
    const { q } = req.query;

    try {
        if (!q) {
            return res.status(400).json({
                success: false,
                message: "Search query is required.",
            });
        }

        const users = await User.find({
            $or: [
                { fullName: { $regex: q, $options: "i" } },
                { email: { $regex: q, $options: "i" } },
                { mobileNo: { $regex: q, $options: "i" } },
            ],
        }).select("-password");

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.log("Error in searchUsers:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};
