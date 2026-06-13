import { Router, Request, Response } from "express";
import { asyncHandler } from "@/utils/errors";
import { requireAuth } from "@/middleware/auth";
import { assignmentService, submissionService, gradingService } from "@/services/assignments";

const router = Router();

/**
 * GET /assignments
 * List assignments (optionally filter by course)
 */
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { courseId } = req.query;
    const assignments = await assignmentService.listAssignments(
      courseId ? String(courseId) : undefined
    );
    res.success(assignments, 200);
  })
);

/**
 * POST /assignments
 * Create assignment (teacher only)
 */
router.post(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.auth!.userId;
    const { courseId, title, description, dueDate, maxGrade } = req.body;

    const assignment = await assignmentService.createAssignment(
      courseId,
      userId,
      {
        title,
        description,
        dueDate,
        maxGrade,
      }
    );

    res.success(assignment, 201);
  })
);

/**
 * GET /assignments/:id
 * Get assignment by ID
 */
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const assignment = await assignmentService.getAssignment(id);
    res.success(assignment, 200);
  })
);

/**
 * DELETE /assignments/:id
 * Delete assignment (teacher only)
 */
router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.auth!.userId;
    const { id } = req.params;

    await assignmentService.deleteAssignment(id, userId);
    res.success({ success: true }, 200);
  })
);

export default router;
