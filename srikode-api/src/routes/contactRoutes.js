import express from "express";
import {
  submitContact,
  getAllContactsAdmin,
  markContactAsRead,
  deleteContact
} from "../controllers/contactController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { contactLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
router.post("/", contactLimiter, submitContact);

// --- ADMIN ROUTES ---
router.use(isAuthenticated, authorizeRoles("admin"));

router.get("/admin/all", getAllContactsAdmin);
router.put("/admin/read/:id", markContactAsRead);
router.delete("/admin/delete/:id", deleteContact);

export default router;
