import express from "express";
import authRoutes from "./authRoutes.js";
import blogRoutes from "./blogRoutes.js";
import commentRoutes from "./commentRoutes.js";
import videoRoutes from "./videoRoutes.js";
import contactRoutes from "./contactRoutes.js";
import analyticsRoutes from "./analyticsRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/blogs", blogRoutes);
router.use("/comments", commentRoutes);
router.use("/videos", videoRoutes);
router.use("/contact", contactRoutes);
router.use("/analytics", analyticsRoutes);

export default router;