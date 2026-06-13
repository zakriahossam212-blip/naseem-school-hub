import "express-async-errors";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { config, validateConfig } from "@/config/index";
import { swaggerSpec } from "@/config/swagger";
import { connectDatabase, disconnectDatabase } from "@/utils/db";
import { errorHandler, asyncHandler } from "@/utils/errors";
import { responseMiddleware } from "@/middleware/response";

// Routes
import authRoutes from "@/routes/auth";
import coursesRoutes from "@/routes/courses";
import assignmentsRoutes from "@/routes/assignments";
import submissionsRoutes from "@/routes/submissions";
import profilesRoutes from "@/routes/profiles";
import enrollmentsRoutes from "@/routes/enrollments";
import scheduleRoutes from "@/routes/schedule";
import messagesRoutes from "@/routes/messages";
import parentRoutes from "@/routes/parent";

const app = express();

// ============================================================================
// MIDDLEWARE
// ============================================================================

// CORS Configuration - Strong & Secure
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    const allowedOrigins = [
      config.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
      // Add production frontend URLs here
      // "https://naseem-hub.com",
      // "https://app.naseem-hub.com",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy violation"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Length", "X-Total-Count"],
  maxAge: 86400, // 24 hours
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Response helper middleware
app.use(responseMiddleware);

// ============================================================================
// ROUTES
// ============================================================================

// Swagger Documentation
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-spec", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Health check
app.get(
  "/health",
  asyncHandler(async (req, res) => {
    res.success({ status: "ok", timestamp: new Date().toISOString() });
  })
);

// API Routes
const apiPrefix = "/api";
app.use(`${apiPrefix}/auth`, authRoutes);
app.use(`${apiPrefix}/courses`, coursesRoutes);
app.use(`${apiPrefix}/assignments`, assignmentsRoutes);
app.use(`${apiPrefix}/submissions`, submissionsRoutes);
app.use(`${apiPrefix}/profiles`, profilesRoutes);
app.use(`${apiPrefix}/enrollments`, enrollmentsRoutes);
app.use(`${apiPrefix}/schedule`, scheduleRoutes);
app.use(`${apiPrefix}/messages`, messagesRoutes);
app.use(`${apiPrefix}/parent`, parentRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Not found",
    code: "NOT_FOUND",
    timestamp: new Date().toISOString(),
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// ============================================================================
// SERVER START
// ============================================================================

export async function start() {
  try {
    // Validate config
    validateConfig();

    // Connect to database
    await connectDatabase();

    // Start server
    app.listen(config.PORT, () => {
      console.log(`
✅ Server running on http://localhost:${config.PORT}
📚 API endpoint: http://localhost:${config.PORT}/api
📖 Swagger Docs: http://localhost:${config.PORT}/docs
🏥 Health check: http://localhost:${config.PORT}/health
      `);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("🛑 SIGTERM received, shutting down gracefully...");
  await disconnectDatabase();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received, shutting down gracefully...");
  await disconnectDatabase();
  process.exit(0);
});

// Start if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  start().catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });
}

export default app;
