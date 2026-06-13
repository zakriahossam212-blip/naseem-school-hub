import { Router, Request, Response } from "express";
import { asyncHandler } from "@/utils/errors";
import { requireAuth } from "@/middleware/auth";

const router = Router();

/**
 * POST /parent/link
 * Link parent to student
 */
router.post(
  "/link",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement parent linking service
    res.error("Not implemented yet", 501);
  })
);

/**
 * GET /parent/students
 * Get list of students linked to parent
 */
router.get(
  "/students",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement parent service
    res.success([], 200);
  })
);

/**
 * GET /parent/students/:studentId/grades
 * Get student's grades
 */
router.get(
  "/students/:studentId/grades",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement assignment service
    res.success([], 200);
  })
);

/**
 * GET /parent/students/:studentId/courses
 * Get student's courses
 */
router.get(
  "/students/:studentId/courses",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    // TODO: Implement course service for parent view
    res.success([], 200);
  })
);

export default router;
