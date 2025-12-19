import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./config/env.config.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import userRoutes from "./routes/user.routes.js";
const app = express();

app.use(
    cors({
        origin: env.CLIENT_ORIGIN,
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Task Flow Backend API is running 🚀",
    });
});


app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.message);
    res.status(500).json({
        success: false,
        message: "Something went wrong Internal Server Error",
    });
});
export default app;