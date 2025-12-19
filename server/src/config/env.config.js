import dotenv from "dotenv";
dotenv.config();

const requiredEnv = ["MONGODB_URI", "PORT", "JWT_TOKEN_SECRET_KEY", "JWT_TOKEN_EXPIRATION_TIME", "CLIENT_ORIGIN"];

requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        console.error(`Missing required environment variable: ${key}`);
        process.exit(1);
    };
});

export const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    JWT_TOKEN_SECRET_KEY: process.env.JWT_TOKEN_SECRET_KEY,
    JWT_TOKEN_EXPIRATION_TIME: process.env.JWT_TOKEN_EXPIRATION_TIME,
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:5173",

};