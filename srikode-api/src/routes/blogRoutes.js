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
import multer from "multer";
import { getImageKitAuthParams, convertAndUploadImage } from "../controllers/imagekitController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import { publishScheduledMiddleware } from "../services/scheduleService.js";

const router = express.Router();

// In-memory upload for server-side WebP conversion. 4MB stays under Vercel's 4.5MB body limit.
const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => cb(null, /^image\/(png|jpe?g|webp|gif|avif)$/.test(file.mimetype))
});

const handleImageUpload = (req, res, next) => {
  imageUpload.single("image")(req, res, (err) => {
    if (err) {
      const tooLarge = err.code === "LIMIT_FILE_SIZE";
      return res.status(tooLarge ? 413 : 400).json({
        success: false,
        message: tooLarge ? "Image is too large (max 4MB after cropping)." : err.message
      });
    }
    next();
  });
};

// Publish any scheduled posts that are due before serving public or admin reads
router.use(publishScheduledMiddleware);

// --- PUBLIC ROUTES ---
router.get("/", getAllBlogsPublic);
router.get("/featured", getFeaturedBlogs);
router.get("/post/:slug", getBlogBySlug); // /api/v1/blogs/post/:slug

// --- ADMIN ROUTES ---
// Protect all routes below with Authentication and Role Check
router.use(isAuthenticated, authorizeRoles("admin"));

router.get("/admin/imagekit/auth", getImageKitAuthParams);
router.post("/admin/upload-image", handleImageUpload, convertAndUploadImage);
router.get("/admin/analytics", getAnalyticsAdmin);
router.get("/admin/all", getAllBlogsAdmin);
router.get("/admin/post/:id", getBlogByIdAdmin);
router.post("/admin/post", createBlogAdmin);
router.put("/admin/post/:id", updateBlogAdmin);
router.delete("/admin/post/:id", deleteBlogAdmin);

export default router;
