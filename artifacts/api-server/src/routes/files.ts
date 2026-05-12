import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { ObjectPermission } from "../lib/objectAcl";

const router: IRouter = Router();
const storage = new ObjectStorageService();

/**
 * POST /files/upload-url  (auth required)
 * Step 1: request a presigned GCS PUT URL.
 * Returns { uploadURL, objectPath } — client uploads to uploadURL, then
 * calls POST /files/register with objectPath to claim ownership.
 */
router.post("/files/upload-url", requireAuth, async (req, res): Promise<void> => {
  try {
    const uploadURL = await storage.getObjectEntityUploadURL();
    const objectPath = storage.normalizeObjectEntityPath(uploadURL);
    res.json({ uploadURL, objectPath });
  } catch (err) {
    console.error("GCS presign error", err);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

/**
 * POST /files/register  (auth required)
 * Step 3: after client uploads to GCS, register the upload and set owner ACL.
 * Body: { objectPath: string }
 * Returns: { objectPath }
 */
router.post("/files/register", requireAuth, async (req, res): Promise<void> => {
  const { objectPath } = req.body as { objectPath?: string };
  if (!objectPath || !objectPath.startsWith("/objects/")) {
    res.status(400).json({ error: "Valid objectPath required" });
    return;
  }
  try {
    const normalized = await storage.trySetObjectEntityAclPolicy(objectPath, {
      owner: req.authUserId,
      visibility: "private",
    });
    res.json({ objectPath: normalized });
  } catch (err) {
    if (err instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Object not found — upload may not have completed" });
    } else {
      console.error("ACL register error", err);
      res.status(500).json({ error: "Failed to register upload" });
    }
  }
});

/**
 * GET /files/objects  (auth required)
 * Serve a private GCS object. Only the owner may read it.
 * Query: ?path=uploads/some-uuid (the part after /objects/)
 */
router.get("/files/objects", requireAuth, async (req, res): Promise<void> => {
  const subPath = typeof req.query.path === "string" ? req.query.path.replace(/^\/+/, "") : "";
  if (!subPath) { res.status(400).json({ error: "path query param required" }); return; }
  const rawPath = "/objects/" + subPath;
  try {
    const file = await storage.getObjectEntityFile(rawPath);

    // Enforce ACL — only owner (or public) may access
    const allowed = await storage.canAccessObjectEntity({
      userId: req.authUserId,
      objectFile: file,
      requestedPermission: ObjectPermission.READ,
    });
    if (!allowed) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }

    const response = await storage.downloadObject(file);
    const contentType = response.headers.get("content-type") ?? "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "private, max-age=3600");
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    if (err instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "File not found" });
    } else {
      console.error("GCS serve error", err);
      res.status(500).json({ error: "Failed to serve file" });
    }
  }
});

export default router;
