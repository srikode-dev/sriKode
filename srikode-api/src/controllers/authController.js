import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ADMIN_EMAIL, JWT_SECRET } from "../config/envConfig.js";
import logger from "../config/logger.js";

/**
 * Admin Login Handler
 * Checks credentials against environment variables and signs JWT.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check email
    if (email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      logger.warn(`Failed login attempt: Unknown email ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check hashed password stored in process.env.ADMIN_PASSWORD_HASH
    const adminHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminHash) {
      logger.error("Authentication Error: ADMIN_PASSWORD_HASH is not set in environment variables");
      return res.status(500).json({
        success: false,
        message: "Server configuration error. Please contact developer.",
      });
    }

    const isMatch = await bcrypt.compare(password, adminHash);

    if (!isMatch) {
      logger.warn(`Failed login attempt: Incorrect password for ${email}`);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Sign JWT token with admin payload (future-proofed with role: "admin")
    const payload = {
      id: "admin-srikode",
      name: "Srikant Sahu",
      email: ADMIN_EMAIL,
      role: "admin",
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: "7d", // Token valid for 7 days
    });

    logger.info(`Admin successfully logged in: ${email}`);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: `Bearer ${token}`,
      user: payload,
    });
  } catch (error) {
    logger.error(`Login handler error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * Get authenticated user profile details (for client-side token validation)
 */
export const getMe = async (req, res) => {
  try {
    // req.user is populated by isAuthenticated middleware
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    logger.error(`getMe handler error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
