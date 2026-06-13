import { Router, Request, Response } from "express";
import { asyncHandler } from "@/utils/errors";
import { requireAuth } from "@/middleware/auth";
import { authService } from "@/services/auth";
import { profileService } from "@/services/auth";

const router = Router();

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Unauthorized
 */
router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.auth!.userId;
    const profile = await profileService.getProfile(userId);

    res.success(
      {
        userId: profile.userId,
        fullName: profile.fullName,
        roles: ["student"], // TODO: Get from profile.role
      },
      200
    );
  })
);

/**
 * @swagger
 * /auth/ensure-profile:
 *   post:
 *     summary: Create or update user profile on first login
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [student, teacher, parent]
 *     responses:
 *       201:
 *         description: Profile created/updated
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/ensure-profile",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.auth!.userId;
    const { fullName, role } = req.body;

    const profile = await authService.ensureProfile(userId, {
      fullName,
      role,
    });

    res.success(
      {
        userId: profile.userId,
        fullName: profile.fullName,
        roles: profile.roles || [profile.role || "student"],
      },
      201
    );
  })
);

export default router;
