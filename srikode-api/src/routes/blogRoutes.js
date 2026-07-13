import express from "express";
import {
  getAllBlogsPublic,
  getFeaturedBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  getBlogByIdAdmin,
  createBlogAdmin,
  updateBlogAdmin,
  deleteBlogAdmin,
  getAnalyticsAdmin
} from "../controllers/blogController.js";
import { getImageKitAuthParams } from "../controllers/imagekitController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// --- PUBLIC ROUTES ---
router.get("/", getAllBlogsPublic);
router.get("/featured", getFeaturedBlogs);
router.get("/post/:slug", getBlogBySlug); // /api/v1/blogs/post/:slug

// --- ADMIN ROUTES ---
// Protect all routes below with Authentication and Role Check
router.use(isAuthenticated, authorizeRoles("admin"));

router.get("/admin/imagekit/auth", getImageKitAuthParams);
router.get("/admin/analytics", getAnalyticsAdmin);
router.get("/admin/all", getAllBlogsAdmin);
router.get("/admin/post/:id", getBlogByIdAdmin);
router.post("/admin/post", createBlogAdmin);
router.put("/admin/post/:id", updateBlogAdmin);
router.delete("/admin/post/:id", deleteBlogAdmin);

export default router;
