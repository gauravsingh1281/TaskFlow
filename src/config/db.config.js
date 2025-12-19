import mongoose from "mongoose";
import { env } from "./env.config.js";
const connectDB = async () => {
    try {
        const mongoDbConnected = await mongoose.connect(env.MONGODB_URI);
        console.log(`MongoDb Connected at ${mongoDbConnected.connection.host}`);
    } catch (error) {
        console.error(`MongoDB failed to Connect Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;