import express from "express";
import { login, getMe } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

// Public login route
router.post("/login", login);

// Protected check identity route (primarily used for dashboard reload validations)
router.get("/me", isAuthenticated, getMe);

export default router;
