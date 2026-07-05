import express from "express";
import {
  getVisibleVideosPublic,
  getAllVideosAdmin,
  syncVideosAdmin,
  toggleVideoHidden
} from "../controllers/videoController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get("/", getVisibleVideosPublic);

// --- ADMIN ROUTES ---
router.use(isAuthenticated, authorizeRoles("admin"));

router.get("/admin/all", getAllVideosAdmin);
router.post("/admin/sync", syncVideosAdmin);
router.put("/admin/hide/:id", toggleVideoHidden);

export default router;
