import logger from "../config/logger.js";

/**
 * Global Error Handling Middleware.
 * Prevents leaks of stack traces in production.
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`);

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export default errorHandler;
