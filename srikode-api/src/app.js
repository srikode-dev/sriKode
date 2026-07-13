import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import logger, { logStream } from "./config/logger.js";
import { API_VERSION } from "./config/envConfig.js";
import corsOptions from "./config/cors.js";
import router from "./routes/index.js";
import errorHandler from "./middlewares/errorHandler.js";
import mongoSanitize from "express-mongo-sanitize";
import { xss } from "express-xss-sanitizer";
import hpp from "hpp";
import { globalLimiter } from "./middlewares/rateLimiter.js";
const app = express();
const apiVersion = API_VERSION;

// security middleware
app.use(helmet());

//logger middleware
app.use(morgan("combined", { stream: logStream }));

//cors Middleware
app.use(cors(corsOptions));

//body parser middleware
app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// Data sanitization against NoSQL query injection
app.use((req, res, next) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
});

// Data sanitization against XSS (Whitelist fields that need to retain HTML/special characters)
app.use(xss({ allowedKeys: ['content', 'faq', 'title', 'excerpt', 'category', 'description', 'seo', 'seo.title', 'seo.description', 'seo.keywords', 'tags'] }));

// Prevent HTTP parameter pollution
app.use(hpp());

// Apply global rate limiting
app.use(globalLimiter);

// health route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    name: "SriKode — Portfolio API",
    description:
      "WOW its Working",
    version: `api/${apiVersion}`,
    status: "🟢 I am Online",
    docs: `Use /api/${apiVersion}/ to access the API endpoints.`,
    author: {
      name: "Srikant Sahu",
      website: "https://srikantsahu.in",
      github: "https://github.com/Srikant114",
    },
    timestamp: new Date().toISOString(),
  });
});

// api routes
app.use(`/api/${apiVersion}`, router);

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
