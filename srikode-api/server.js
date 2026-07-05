import dotenv from "dotenv";
dotenv.config({ quiet: true });

import app from "./src/app.js";
import connectDb from "./src/config/db.js";
import logger from "./src/config/logger.js";
import apiTracker from "./src/config/apiTracker.js";
import { NODE_ENV, PORT } from "./src/config/envConfig.js";

// Connect to MongoDB
connectDb();

if (process.env.VERCEL === "1") {
  // ─── Vercel Serverless ────────────────────────────────────────────────────
  // Vercel manages the HTTP lifecycle — app.listen() must NOT be called.
  // The exported app is wrapped automatically by @vercel/node.
  // (intentionally empty — export below handles it)
} else {
  // ─── Local Development ────────────────────────────────────────────────────
  app.listen(PORT, () => {
    logger.info("====================================");
    logger.info(`🚀 Server running on port ${PORT}`);
    logger.info(`🌍 Environment: ${NODE_ENV}`);
    logger.info("====================================");
    apiTracker(app);
  });
}

export default app;
