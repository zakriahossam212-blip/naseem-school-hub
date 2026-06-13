import { Router, Request, Response } from "express";
import { asyncHandler } from "@/utils/errors";
import { requireAuth } from "@/middleware/auth";
import { enrollmentService } from "@/services/courses";

const router = Router();

/**
 * GET /enrollments
 * Get list of course IDs that current user is enrolled in
 */
router.get(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.auth!.userId;
    const courseIds = await enrollmentService.getStudentEnrollments(userId);
    res.success(courseIds, 200);
  })
);

export default router;
