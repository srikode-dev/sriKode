import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import logger, { logStream } from "./config/logger.js";
import { API_VERSION } from "./config/envConfig.js";
import corsOptions from "./config/cors.js";
import router from "./routes/index.js";

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

// app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

export default app;
