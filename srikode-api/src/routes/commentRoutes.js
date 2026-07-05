import express from "express";
import {
  getCommentsByBlog,
  submitComment,
  getAllCommentsAdmin,
  toggleCommentApproval,
  deleteComment
} from "../controllers/commentController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get("/post/:slug", getCommentsByBlog);
router.post("/post/:slug", submitComment);

// --- ADMIN ROUTES ---
router.use(isAuthenticated, authorizeRoles("admin"));

router.get("/admin/all", getAllCommentsAdmin);
router.put("/admin/approve/:id", toggleCommentApproval);
router.delete("/admin/delete/:id", deleteComment);

export default router;
