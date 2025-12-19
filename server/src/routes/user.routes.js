import express from "express";
import authenticateUser from "../middlewares/auth.middleware.js";
import authorizeRole from "../middlewares/role.middleware.js";
import { getAllUsers, searchUsers, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get(
    "/search",
    authenticateUser,
    authorizeRole(["admin"]),
    searchUsers
);

router.get(
    "/",
    authenticateUser,
    authorizeRole(["admin"]),
    getAllUsers
);

router.delete(
    "/:id",
    authenticateUser,
    authorizeRole(["admin"]),
    deleteUser
)

export default router;
