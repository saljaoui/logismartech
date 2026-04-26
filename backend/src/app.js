import express from "express";
import cors from "cors";
import webhookRoutes from "./routes/webhookRoutes.js";
import containerRoutes from "./routes/containerRoutes.js";
import matchRoutes from "./routes/matchRoutes.js";

const app = express();

const allowedOrigins = process.env.FRONTEND_ORIGIN
  ? process.env.FRONTEND_ORIGIN.split(",").map((origin) => origin.trim())
  : ["*"];

app.use(
  cors({
    origin: allowedOrigins.includes("*") ? true : allowedOrigins,
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.json({ success: true, service: "logismartech-backend", status: "up" });
});

app.use("/api", webhookRoutes);
app.use("/api", containerRoutes);
app.use("/api", matchRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use((error, _req, res, _next) => {
  console.error("[API Error]", error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    details: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

export default app;
