import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { profilesTable, userRolesTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { requireAuth } from "../middlewares/requireAuth";

const router: IRouter = Router();

router.get("/auth/me", requireAuth, async (req, res): Promise<void> => {
  const userId = req.authUserId;
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, userId));
  const roles = await db.select().from(userRolesTable).where(eq(userRolesTable.userId, userId));
  res.json({
    userId,
    fullName: profile?.fullName ?? null,
    roles: roles.map((r) => r.role),
  });
});

const VALID_SELF_ASSIGN_ROLES = new Set(["student", "teacher", "parent"]);

router.post("/auth/ensure-profile", requireAuth, async (req, res): Promise<void> => {
  const userId = req.authUserId;
  const { fullName, role } = req.body as { fullName?: string; role?: string };

  // Upsert profile
  const existing = await db.select().from(profilesTable).where(eq(profilesTable.userId, userId));
  if (existing.length === 0) {
    await db.insert(profilesTable).values({ userId, fullName: fullName ?? null });
  } else if (fullName) {
    await db.update(profilesTable).set({ fullName }).where(eq(profilesTable.userId, userId));
  }

  // Only assign role if user has none yet (first onboarding); users cannot reassign themselves
  const existingRoles = await db.select().from(userRolesTable).where(eq(userRolesTable.userId, userId));
  if (existingRoles.length === 0) {
    const assignedRole = (
      VALID_SELF_ASSIGN_ROLES.has(role ?? "") ? role : "student"
    ) as "student" | "teacher" | "parent";
    await db.insert(userRolesTable).values({ userId, role: assignedRole });
  }

  const roles = await db.select().from(userRolesTable).where(eq(userRolesTable.userId, userId));
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, userId));
  res.json({
    userId,
    fullName: profile?.fullName ?? null,
    roles: roles.map((r) => r.role),
  });
});

router.get("/profiles/:userId", async (req, res): Promise<void> => {
  const userId = req.params.userId;
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, userId));
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json({ userId: profile.userId, fullName: profile.fullName, avatarUrl: profile.avatarUrl });
});

router.get("/profiles", async (req, res): Promise<void> => {
  const userIdsParam = req.query.userIds;
  if (typeof userIdsParam !== "string" || !userIdsParam) {
    res.json([]);
    return;
  }
  const userIds = userIdsParam.split(",").filter(Boolean);
  if (userIds.length === 0) {
    res.json([]);
    return;
  }
  const profiles = await db.select().from(profilesTable).where(inArray(profilesTable.userId, userIds));
  res.json(profiles.map((p) => ({ userId: p.userId, fullName: p.fullName, avatarUrl: p.avatarUrl })));
});

export default router;
