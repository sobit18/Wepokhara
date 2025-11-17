import dotenv from "dotenv"
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
// import favicon from "serve-favicon";
import path from "path";


import logger from "./config/logger.config.js";
import router from "./routes/index.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
// import { checkMethodAndEndpoint } from "./middleware/checkMethodsAndEndpoints.js";

const isProd = process.env.NODE_ENV === "production";
const app = express();

// Serve static files
const publicDir = path.join(path.resolve(), "public");
app.use(express.static(path.join(publicDir, "images")));
app.use("/upload", express.static(path.join(publicDir, "images")));

// Security headers
app.use(helmet());
app.set("trust proxy", isProd ? "loopback, linklocal, uniquelocal" : false);

// CORS setup
// const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");
// const allowedOrigins = [
//   "http://localhost",
//   "http://localhost:5173",
//   "http://localhost:5174",
// ];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without origin (like Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // allow cookies
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW || 15) * 60 * 1000, // 15 minutes
  max: Number(process.env.RATE_LIMIT_MAX) || 3000,
});
app.use("/api/", limiter);

// Core middlewares
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// app.use(favicon(path.join(publicDir, "favicon.ico")));
app.use(compression());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next();
});

// Routes
app.set("view engine", "hbs");
app.use("/api", router);

// Check invalid methods and endpoints
// app.use(checkMethodAndEndpoint(app));

// Error handler
app.use(errorMiddleware);

export default app;
// update: optimize database connection (2024-11-16 00:00:00)
// update: implement base API response handler (2024-11-18 00:00:00)
// update: add service layer abstraction (2024-11-24 00:00:00)
// update: minor performance improvements (2024-11-29 00:00:00)
// update: fix route registration issue (2024-12-01 00:00:00)
// update: update README documentation (2024-12-01 00:00:00)
// update: refactor controller logic (2024-12-06 00:00:00)
// update: update README documentation (2024-12-10 00:00:00)
// update: cleanup unused code (2024-12-11 00:00:00)
// update: refactor controller logic (2024-12-19 00:00:00)
// update: implement base API response handler (2024-12-26 00:00:00)
// update: minor performance improvements (2025-01-02 00:00:00)


