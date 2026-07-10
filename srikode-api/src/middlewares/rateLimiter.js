import rateLimit from "express-rate-limit";

// Global rate limiter for the entire API
// Allows 100 requests per 15 minutes per IP
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Specific rate limiter for contact form submissions
// Allows 3 submissions per 60 minutes per IP
export const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 3, // Limit each IP to 3 requests per `window`
  message: {
    success: false,
    message: "You have submitted too many contact requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
