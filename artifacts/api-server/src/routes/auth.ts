import { Router, type IRouter } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@workspace/db";
import { profilesTable, userRolesTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { SignUpBody, SignInBody } from "@workspace/api-zod";
import { logger } from "../lib/logger";

const router: IRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || "lms-secret-key-change-in-production";

const passwordsTable = "user_passwords";

async function ensurePasswordsTable() {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS user_passwords (
        user_id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);
  } catch (e) {
    logger.error({ err: e }, "Failed to ensure passwords table");
  }
}
ensurePasswordsTable();

router.get("/auth/me", async (req, res): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string };
    const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, payload.userId));
    const roles = await db.select().from(userRolesTable).where(eq(userRolesTable.userId, payload.userId));
    res.json({
      userId: payload.userId,
      fullName: profile?.fullName ?? null,
      roles: roles.map((r) => r.role),
    });
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
});

router.post("/auth/signup", async (req, res): Promise<void> => {
  const parsed = SignUpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, password, fullName, role } = parsed.data;

  try {
    const existing = await db.execute({
      sql: "SELECT user_id FROM user_passwords WHERE email = $1",
      // @ts-ignore
      values: [email],
    });
    // @ts-ignore
    if (existing.rows && existing.rows.length > 0) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }
  } catch {
    // table might not exist yet, continue
  }

  const userId = crypto.randomUUID();
  const passwordHash = await bcrypt.hash(password, 10);

  await db.execute(`
    INSERT INTO user_passwords (user_id, email, password_hash)
    VALUES ('${userId}', '${email.replace(/'/g, "''")}', '${passwordHash}')
    ON CONFLICT (email) DO NOTHING
  `);

  await db.insert(profilesTable).values({ userId, fullName });
  await db.insert(userRolesTable).values({ userId, role: (role || "student") as "student" | "teacher" | "admin" });

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });

  res.status(201).json({
    userId,
    fullName,
    roles: [role || "student"],
    token,
  });
});

router.post("/auth/signin", async (req, res): Promise<void> => {
  const parsed = SignInBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { email, password } = parsed.data;

  let row: { user_id: string; password_hash: string } | null = null;
  try {
    const result = await db.execute(`
      SELECT user_id, password_hash FROM user_passwords WHERE email = '${email.replace(/'/g, "''")}'
    `);
    // @ts-ignore
    if (result.rows && result.rows.length > 0) {
      // @ts-ignore
      row = result.rows[0] as { user_id: string; password_hash: string };
    }
  } catch (e) {
    req.log.error({ err: e }, "DB error on signin");
    res.status(500).json({ error: "Server error" });
    return;
  }

  if (!row) {
    res.status(401).json({ error: "Invalid login credentials" });
    return;
  }

  const valid = await bcrypt.compare(password, row.password_hash);
  if (!valid) {
    res.status(401).json({ error: "Invalid login credentials" });
    return;
  }

  const userId = row.user_id;
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, userId));
  const roles = await db.select().from(userRolesTable).where(eq(userRolesTable.userId, userId));

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "30d" });

  res.json({
    userId,
    token,
    fullName: profile?.fullName ?? null,
    roles: roles.map((r) => r.role),
  });
});

router.post("/auth/signout", async (_req, res): Promise<void> => {
  res.json({ success: true });
});

router.get("/profiles/:userId", async (req, res): Promise<void> => {
  const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
  const [profile] = await db.select().from(profilesTable).where(eq(profilesTable.userId, userId));
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json({ userId: profile.userId, fullName: profile.fullName, avatarUrl: profile.avatarUrl });
});

router.get("/profiles", async (req, res): Promise<void> => {
  const userIdsParam = req.query.userIds as string;
  if (!userIdsParam) {
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
