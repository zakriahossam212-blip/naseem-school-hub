import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/requireAuth";
import { ObjectStorageService } from "../lib/objectStorage";

const router: IRouter = Router();
const storage = new ObjectStorageService();

/**
 * POST /files/upload-url  (auth required)
 * Returns a presigned GCS PUT URL and the resulting objectPath.
 */
router.post("/files/upload-url", requireAuth, async (_req, res): Promise<void> => {
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
 * GET /files/objects  (auth required)
 * Proxy-stream a private GCS object. Pass the object sub-path as ?path=...
 * e.g. GET /files/objects?path=uploads/some-uuid
 */
router.get("/files/objects", requireAuth, async (req, res): Promise<void> => {
  const subPath = typeof req.query.path === "string" ? req.query.path.replace(/^\/+/, "") : "";
  if (!subPath) { res.status(400).json({ error: "path query param required" }); return; }
  const rawPath = "/objects/" + subPath;
  try {
    const file = await storage.getObjectEntityFile(rawPath);
    const response = await storage.downloadObject(file);
    const contentType = response.headers.get("content-type") ?? "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "private, max-age=3600");
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err: unknown) {
    const msg = (err as Error).message ?? "";
    if (msg.includes("not found") || msg.includes("404")) {
      res.status(404).json({ error: "File not found" });
    } else {
      console.error("GCS serve error", err);
      res.status(500).json({ error: "Failed to serve file" });
    }
  }
});

export default router;
