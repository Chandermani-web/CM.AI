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

app.use(morgan("dev"));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());

const services = [
  { path: "/api/auth", url: process.env.AUTH_SERVICE_URL, description: "Handles user authentication and authorization" },
  { path: "/api/resume", url: process.env.RESUME_SERVICE_URL, description: "Handles resume uploads and parsing (multipart/form-data)" },
  { path: "/api/interview", url: process.env.INTERVIEW_SERVICE_URL, description: "Handles interview scheduling and management" },
  { path: "/api/roadmap", url: process.env.ROADMAP_SERVICE_URL, description: "Handles roadmap generation and tracking" },
  { path: "/api/billing", url: process.env.BILLING_SERVICE_URL, description: "Handles billing and subscription management" },
  { path: "/api/me", url: "local", description: "Returns the currently authenticated user" },
];

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "gateway",
  });
});

app.use("/api/auth", express.json({ limit: "25mb" }), express.urlencoded({ extended: true, limit: "25mb" }), proxy(`${process.env.AUTH_SERVICE_URL}`));
app.use("/api/resume", isAuth, proxyWithHeaders(`${process.env.RESUME_SERVICE_URL}`));
app.use("/api/interview", isAuth, express.json({ limit: "25mb" }), express.urlencoded({ extended: true, limit: "25mb" }), proxyWithHeaders(`${process.env.INTERVIEW_SERVICE_URL}`));
app.use("/api/roadmap", isAuth, proxyWithHeaders(`${process.env.ROADMAP_SERVICE_URL}`));
app.use("/api/billing", isAuth, proxyWithHeaders(`${process.env.BILLING_SERVICE_URL}`));
app.get("/api/me", isAuth, getCurrentUser);

const colors = { red: "\x1b[31m", green: "\x1b[32m", yellow: "\x1b[33m", blue: "\x1b[34m", magenta: "\x1b[35m", cyan: "\x1b[36m", white: "\x1b[37m", reset: "\x1b[0m", bold: "\x1b[1m",};

const palette = [colors.red, colors.green, colors.yellow, colors.blue, colors.magenta, colors.cyan, colors.white];

function printServices() {
  console.log(`${colors.bold}\n=== Gateway Services ===${colors.reset}`);
  services.forEach((s, i) => {
    const color = palette[i % palette.length];
    console.log(`${color}${JSON.stringify(s, null, 2)}${colors.reset}`);
  });
  console.log(`${colors.bold}========================${colors.reset}\n`);
}

app.listen(port, () => {
  console.log(`${colors.yellow}Gateway server is running on port ${port}${colors.reset}`);
  printServices();
});