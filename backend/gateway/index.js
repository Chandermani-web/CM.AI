import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";

import { isAuth } from "./middleware/isAuth.js";
import { getCurrentUser } from "./controller/user.controller.js";
import { proxyWithHeaders } from "./utils/proxyWithHeaders.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 8000;

// ================================
// GLOBAL MIDDLEWARE
// ================================

app.use(morgan("dev"));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

// ================================
// AUTH SERVICE
// ================================

app.use(
  "/api/auth",
  express.json({ limit: "25mb" }),
  express.urlencoded({
    extended: true,
    limit: "25mb",
  }),
  proxy(`${process.env.AUTH_SERVICE_URL}`)
);

// ================================
// RESUME SERVICE
// ================================

// IMPORTANT:
// DO NOT use express.json() here.
// DO NOT use express.urlencoded() here.
//
// This allows multipart/form-data / PDF uploads
// to pass through to the resume service.

app.use(
  "/api/resume",
  isAuth,
  proxyWithHeaders(`${process.env.RESUME_SERVICE_URL}`)
);

// ================================
// INTERVIEW SERVICE
// ================================

app.use(
  "/api/interview",
  isAuth,
  express.json({ limit: "25mb" }),
  express.urlencoded({
    extended: true,
    limit: "25mb",
  }),
  proxyWithHeaders(`${process.env.INTERVIEW_SERVICE_URL}`)
);

// ================================
// ROADMAP SERVICE
// ================================
app.use("/api/roadmap", isAuth, proxyWithHeaders(`${process.env.ROADMAP_SERVICE_URL}`));

// ================================
// BILLING SERVICE
// ================================
app.use("/api/billing", isAuth, proxyWithHeaders(`${process.env.BILLING_SERVICE_URL}`));

// ================================
// CURRENT USER
// ================================
app.get(
  "/api/me",
  isAuth,
  getCurrentUser
);

// ================================
// SERVER
// ================================

app.listen(port, () => {
  console.log(`Gateway server is running on port ${port}`);
});