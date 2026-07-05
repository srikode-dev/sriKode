import express from "express";
import { getAdminAnalytics } from "../controllers/analyticsController.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// Protect all routes with auth & admin authorization
router.use(isAuthenticated, authorizeRoles("admin"));

router.get("/", getAdminAnalytics);

export default router;
