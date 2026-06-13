import { Router, Request, Response } from "express";
import { asyncHandler } from "@/utils/errors";
import { requireAuth } from "@/middleware/auth";
import { courseService, enrollmentService } from "@/services/courses";

const router = Router();

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: List all courses
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: teacherId
 *         schema:
 *           type: string
 *         description: Filter by teacher ID
 *     responses:
 *       200:
 *         description: List of courses
 */
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    const { teacherId } = req.query;
    const courses = await courseService.listCourses(
      teacherId ? String(teacherId) : undefined
    );
    res.success(courses, 200);
  })
);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Course created
 */
router.post(
  "/",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.auth!.userId;
    const { title, description } = req.body;

    const course = await courseService.createCourse(userId, {
      title,
      description,
    });

    res.success(course, 201);
  })
);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details
 *       404:
 *         description: Course not found
 */
router.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const course = await courseService.getCourse(id);
    res.success(course, 200);
  })
);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update course
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Course updated
 */
router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.auth!.userId;
    const { id } = req.params;
    const { title, description } = req.body;

    const course = await courseService.updateCourse(id, userId, {
      title,
      description,
    });

    res.success(course, 200);
  })
);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete course
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted
 */
router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.auth!.userId;
    const { id } = req.params;

    await courseService.deleteCourse(id, userId);
    res.success({ success: true }, 200);
  })
);

/**
 * @swagger
 * /courses/{id}/enroll:
 *   post:
 *     summary: Enroll student in course
 *     tags: [Courses]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successfully enrolled
 */
router.post(
  "/:id/enroll",
  requireAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = req.auth!.userId;
    const { id } = req.params;

    await enrollmentService.enrollStudent(id, userId);
    res.success({ success: true }, 201);
  })
);

export default router;
