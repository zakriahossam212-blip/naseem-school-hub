import { Router, Request, Response } from "express";
import { asyncHandler } from "@/utils/errors";
import { requireAuth } from "@/middleware/auth";

const router = Router();

/**
 * GET /schedule
 * Get all schedule entries
 */
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement schedule service
    res.success([], 200);
  })
);

/**
 * POST /schedule
 * Create schedule entry
 */
router.post(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement schedule service
    res.error("Not implemented yet", 501);
  })
);

/**
 * DELETE /schedule/:id
 * Delete schedule entry
 */
router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement schedule service
    res.error("Not implemented yet", 501);
  })
);

export default router;
