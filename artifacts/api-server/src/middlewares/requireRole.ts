import type { Request, Response, NextFunction } from "express";
import { db } from "@workspace/db";
import { userRolesTable } from "@workspace/db";
import { and, eq, inArray } from "drizzle-orm";

type AppRole = "admin" | "teacher" | "student" | "parent";

/**
 * Middleware factory: reject requests where the authenticated user does NOT
 * hold at least one of the specified roles.
 * Must be used after requireAuth (relies on req.authUserId).
 */
export function requireRole(...roles: AppRole[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.authUserId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const rows = await db.select().from(userRolesTable)
      .where(and(eq(userRolesTable.userId, userId), inArray(userRolesTable.role, roles)));
    if (rows.length === 0) {
      res.status(403).json({ error: `Requires one of roles: ${roles.join(", ")}` });
      return;
    }
    next();
  };
}
