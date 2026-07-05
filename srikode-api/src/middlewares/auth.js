import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/envConfig.js";
import logger from "../config/logger.js";

/**
 * Middleware to authenticate requests using JWT.
 * Expects Bearer token in the Authorization header.
 */
export const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: No token provided",
      });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        logger.warn(`Failed token verification: ${err.message}`);
        return res.status(401).json({
          success: false,
          message: "Access Denied: Invalid or expired token",
        });
      }

      req.user = decoded; // Attach user payload to request
      next();
    });
  } catch (error) {
    logger.error(`Auth middleware error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

/**
 * Middleware to authorize specific user roles.
 * Must be used after isAuthenticated.
 * 
 * @param {...string} roles - The roles allowed to access this route
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(500).json({
        success: false,
        message: "Authorization error: User details missing from request",
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(`Unauthorized role access attempt: user ${req.user.email} (${req.user.role}) tried to access route restricted to ${roles.join(", ")}`);
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to roles: [${roles.join(", ")}]`,
      });
    }

    next();
  };
};
