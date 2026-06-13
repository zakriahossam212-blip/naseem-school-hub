import { Router, Request, Response } from "express";
import { asyncHandler } from "@/utils/errors";
import { requireAuth } from "@/middleware/auth";
import { submissionService, gradingService } from "@/services/assignments";

const router = Router();

/**
 * GET /submissions
 * List submissions (optionally filter by assignment)
 */
router.get(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { assignmentId } = req.query;

    if (!assignmentId) {
      return res.error("assignmentId query parameter is required", 400);
    }

    const submissions = await submissionService.getSubmissions(
      String(assignmentId)
    );
    res.success(submissions, 200);
  })
);

/**
 * POST /submissions
 * Submit an assignment
 */
router.post(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.auth!.userId;
    const { assignmentId, content, fileUrl } = req.body;

    const submission = await submissionService.submitAssignment(
      assignmentId,
      userId,
      {
        content,
        fileUrl,
      }
    );

    res.success(submission, 201);
  })
);

/**
 * PATCH /submissions/:id
 * Update submission (student) or grade it (teacher)
 */
router.patch(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.auth!.userId;
    const { id } = req.params;
    const { content, fileUrl, grade, feedback } = req.body;

    // TODO: Determine if user is grading or updating their own submission
    // For now, assume grading if grade is provided
    let submission;

    if (grade !== undefined) {
      submission = await gradingService.gradeSubmission(id, userId, {
        grade,
        feedback,
      });
    } else {
      // Student updating their submission
      // This would require a separate update method
      return res.error("Update not yet implemented", 501);
    }

    res.success(submission, 200);
  })
);

export default router;
