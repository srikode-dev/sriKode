import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level}: ${message}`;
});

// Vercel sets process.env.VERCEL = "1" automatically in its environment.
// File transports are only added locally — Vercel's filesystem is read-only
// and would throw EROFS at startup if we tried to write log files there.
// The safest check is to rely on NODE_ENV.
const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";

const transports = [
  new winston.transports.Console({
    format: combine(
      colorize(),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      logFormat,
    ),
  }),
];

const exceptionHandlers = [];

if (!isProduction) {
  // local file logging
  transports.push(
    new winston.transports.File({ filename: "src/logs/combined.log" }),
    new winston.transports.File({
      filename: "src/logs/error.log",
      level: "error",
    }),
  );
  exceptionHandlers.push(
    new winston.transports.File({ filename: "src/logs/exceptions.log" }),
  );
}

const logger = winston.createLogger({
  level: "info",
  format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), logFormat),
  transports,
  ...(exceptionHandlers.length > 0 && { exceptionHandlers }),
});

export const logStream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

export default logger;
