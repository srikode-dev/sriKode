import express from "express";
import {
  subscribe,
  unsubscribe,
  getAllSubscribersAdmin,
  deleteSubscriberAdmin
} from "../controllers/newsletterController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
router.post("/subscribe", subscribe);
router.get("/unsubscribe", unsubscribe);

// --- ADMIN ROUTES ---
router.use(isAuthenticated, authorizeRoles("admin"));

router.get("/admin/all", getAllSubscribersAdmin);
router.delete("/admin/delete/:id", deleteSubscriberAdmin);

export default router;
