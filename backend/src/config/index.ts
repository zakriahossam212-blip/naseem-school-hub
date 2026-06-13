import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Environment
  NODE_ENV: process.env.NODE_ENV || "development",
  isDevelopment: process.env.NODE_ENV === "development",
  isProduction: process.env.NODE_ENV === "production",

  // Server
  PORT: parseInt(process.env.PORT || "3000", 10),
  API_BASE_URL: process.env.API_BASE_URL || "http://localhost:3000",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",

  // Database
  DATABASE_URL: process.env.DATABASE_URL || "",

  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL || "",
  SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || "",
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || "",

  // Clerk Auth
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "",

  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || "info",

  // GCS
  GCS_PROJECT_ID: process.env.GCS_PROJECT_ID || "",
  GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME || "",

  // Validation
  validateRequired: (key: string): string => {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
  },
};

// Validate critical config on startup
export function validateConfig() {
  const required = ["DATABASE_URL", "CLERK_SECRET_KEY", "SUPABASE_URL", "SUPABASE_ANON_KEY"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
}
