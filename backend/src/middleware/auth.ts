import { Request, Response, NextFunction } from "express";
import { verifyToken, clerkClient } from "@clerk/express";
import { errors, AppError } from "@/utils/errors";

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        sessionId?: string;
      };
      user?: {
        id: string;
        email?: string;
        fullName?: string;
      };
    }
  }
}

// Middleware to verify Clerk token
export async function verifyClerkToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw errors.unauthorized("Missing or invalid authorization header");
    }

    const token = authHeader.substring("Bearer ".length);

    // Verify with Clerk
    const decoded = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!decoded.sub) {
      throw errors.unauthorized("Invalid token");
    }

    // Attach user info to request
    req.auth = {
      userId: decoded.sub,
      sessionId: decoded.sid,
    };

    // Optional: fetch user details from Clerk
    try {
      const user = await clerkClient.users.getUser(decoded.sub);
      req.user = {
        id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress,
        fullName: user.fullName || undefined,
      };
    } catch (e) {
      // Continue without full user details
    }

    next();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw errors.unauthorized("Invalid authentication token");
  }
}

// Middleware to require authentication
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.auth?.userId) {
    throw errors.unauthorized("Authentication required");
  }
  next();
}

// Middleware to require specific roles
export function requireRole(...roles: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth?.userId) {
      throw errors.unauthorized("Authentication required");
    }

    // TODO: Implement role checking against Profile model
    // For now, just ensure user is authenticated
    next();
  };
}
