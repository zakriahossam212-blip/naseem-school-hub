import { Router, Request, Response } from "express";
import { asyncHandler } from "@/utils/errors";
import { requireAuth } from "@/middleware/auth";
import { profileService } from "@/services/auth";

const router = Router();

/**
 * GET /profiles/:userId
 * Get user profile
 */
router.get(
  "/:userId",
  asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const profile = await profileService.getProfile(userId);
    res.success(profile, 200);
  })
);

/**
 * GET /profiles
 * List profiles by userIds (comma-separated query param)
 */
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { userIds } = req.query;

    if (!userIds) {
      return res.error("userIds query parameter is required", 400);
    }

    const ids = String(userIds).split(",");
    const profiles = await profileService.listProfiles(ids);
    res.success(profiles, 200);
  })
);

export default router;
