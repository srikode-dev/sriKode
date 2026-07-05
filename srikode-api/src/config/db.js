import mongoose from "mongoose";
import logger from "./logger.js";
import { MONGO_URI } from "./envConfig.js";

const connectDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info("✅ Database connected successfully");

  } catch (error) {
    logger.error(`❌ Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDb;