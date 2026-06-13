import { Router, Request, Response } from "express";
import { asyncHandler } from "@/utils/errors";
import { requireAuth } from "@/middleware/auth";

const router = Router();

/**
 * GET /messages/inbox
 * Get user's messages
 */
router.get(
  "/inbox",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement message service
    res.success([], 200);
  })
);

/**
 * POST /messages
 * Send a message
 */
router.post(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement message service
    res.error("Not implemented yet", 501);
  })
);

/**
 * PATCH /messages/:id/read
 * Mark message as read
 */
router.patch(
  "/:id/read",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement message service
    res.error("Not implemented yet", 501);
  })
);

export default router;
