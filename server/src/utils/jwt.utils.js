import jwt from "jsonwebtoken";
import { env } from "../config/env.config.js";

export const generateToken = (payload) => {
    return jwt.sign(payload, env.JWT_TOKEN_SECRET_KEY, {
        expiresIn: env.JWT_TOKEN_EXPIRATION_TIME,
    });
};

export const verifyToken = (token) => {
    return jwt.verify(token, env.JWT_TOKEN_SECRET_KEY);
}
