import mongoose from "mongoose";
import Task from "../models/task.model.js";

export const createTask = async (req, res) => {
    const { title, description, dueDate, priority, assignedTo } = req.body;

    try {
        const task = await Task.create({
            title,
            description,
            dueDate,
            priority,
            assignedTo,
            createdBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Task created successfully.",
            data: task,
        });
    } catch (error) {
        console.log("Error in createTask:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};


export const getTasks = async (req, res) => {
    const { page = 1, limit = 5, priority, status } = req.query;

    try {
        const pageNumber = Math.max(1, Number(page));
        const limitNumber = Math.max(1, Number(limit));

        const matchStage = {};

        // Non-admin users should see tasks they created or that are assigned to them
        if (req.user.role !== "admin") {
            const userId = new mongoose.Types.ObjectId(req.user._id);
            matchStage.$or = [
                { assignedTo: userId },
                { createdBy: userId },
            ];
        }

        if (priority) matchStage.priority = priority;
        if (status) matchStage.status = status;

        const tasks = await Task.aggregate([
            { $match: matchStage },
            { $sort: { createdAt: -1 } },
            { $skip: (pageNumber - 1) * limitNumber },
            { $limit: limitNumber },
        ]);

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    } catch (error) {
        console.log("Error in getTasks:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};


export const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found." });
        }

        res.status(200).json({ success: true, data: task });
    } catch (error) {
        console.log("Error in getTaskById:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};


export const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found." });
        }

        res.status(200).json({
            success: true,
            message: "Task updated successfully.",
            data: task,
        });
    } catch (error) {
        console.log("Error in updateTask:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};


export const updateTaskStatus = async (req, res) => {
    const { status } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found." });
        }

        res.status(200).json({
            success: true,
            message: "Task status updated successfully.",
            data: task,
        });
    } catch (error) {
        console.log("Error in updateTaskStatus:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};


export const updateTaskPriority = async (req, res) => {
    const { priority } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { priority },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found." });
        }

        res.status(200).json({
            success: true,
            message: "Task priority updated successfully.",
            data: task,
        });
    } catch (error) {
        console.log("Error in updateTaskPriority:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};


export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found." });
        }

        res.status(200).json({
            success: true,
            message: "Task deleted successfully.",
        });
    } catch (error) {
        console.log("Error in deleteTask:", error.message);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};



export const assignUserToTask = async (req, res) => {
    const { userId } = req.body;

    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { assignedTo: userId },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "User assigned to task successfully.",
            data: task,
        });
    } catch (error) {
        console.log("Error in assignUserToTask:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};



export const removeUserFromTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { assignedTo: null },
            { new: true }
        );

        if (!task) {
            return res.status(404).json({
                success: false,
                message: "Task not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "User removed from task successfully.",
            data: task,
        });
    } catch (error) {
        console.log("Error in removeUserFromTask:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};
