import express from "express";
import authenticateUser from "../middlewares/auth.middleware.js";
import authorizeRole from "../middlewares/role.middleware.js";

import {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    updateTaskStatus,
    updateTaskPriority,
    assignUserToTask,
    removeUserFromTask,
    deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

router.post(
    "/",
    authenticateUser,
    authorizeRole(["admin"]),
    createTask
);


router.get(
    "/",
    authenticateUser,
    getTasks
);


router.get(
    "/:id",
    authenticateUser,
    getTaskById
);


router.put(
    "/:id",
    authenticateUser,
    authorizeRole(["admin"]),
    updateTask
);


router.patch(
    "/:id/status",
    authenticateUser,
    updateTaskStatus
);


router.patch(
    "/:id/priority",
    authenticateUser,
    authorizeRole(["admin"]),
    updateTaskPriority
);


router.patch(
    "/:id/assign",
    authenticateUser,
    authorizeRole(["admin"]),
    assignUserToTask
);


router.patch(
    "/:id/unassign",
    authenticateUser,
    authorizeRole(["admin"]),
    removeUserFromTask
);


router.delete(
    "/:id",
    authenticateUser,
    authorizeRole(["admin"]),
    deleteTask
);

export default router;
