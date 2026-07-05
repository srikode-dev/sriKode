import { CLIENT_URLS } from "./envConfig.js";

const allowedOrigins = CLIENT_URLS;

const corsOptions = {
  origin: (origin, callback) => {

    // allow requests with no origin:
    // - Postman / Thunder Client / curl (no origin header)
    // - direct browser address bar visit (origin is undefined)
    if (!origin) {
      return callback(null, true);
    }

    // allow whitelisted frontend origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // allow the backend's own vercel deployment domain
    // (so direct browser visits to the API URL are not blocked)
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    // block all other unknown origins
    return callback(new Error("Not allowed by CORS"));
  },

  credentials: true,
};

export default corsOptions;