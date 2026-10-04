import express from "express";
import { getCmsConfig, updateCmsConfig } from "../controllers/cmsController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// Public route to read sections & theme config for the frontend
router.get("/", getCmsConfig);

// Admin-only route to update CMS sections and theme settings
router.put("/", isAuthenticated, authorizeRoles("admin"), updateCmsConfig);

export default router;
