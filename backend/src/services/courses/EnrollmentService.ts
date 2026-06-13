import { db } from "@/utils/db";
import { errors } from "@/utils/errors";
import { CourseDto } from "@/types/index";

export class EnrollmentService {
  /**
   * Enroll student in course
   */
  async enrollStudent(courseId: string, studentId: string): Promise<void> {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw errors.notFound("Course not found");
    }

    const existing = await db.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId, courseId },
      },
    });

    if (existing) {
      throw errors.conflict("Student is already enrolled in this course");
    }

    await db.enrollment.create({
      data: { studentId, courseId },
    });
  }

  /**
   * Get student enrollments (enrolled course IDs)
   */
  async getStudentEnrollments(studentId: string): Promise<string[]> {
    const enrollments = await db.enrollment.findMany({
      where: { studentId },
      select: { courseId: true },
    });

    return enrollments.map((e) => e.courseId);
  }

  /**
   * Get student's enrolled courses with details
   */
  async listStudentCourses(studentId: string): Promise<CourseDto[]> {
    const enrollments = await db.enrollment.findMany({
      where: { studentId },
      include: { course: true },
    });

    return enrollments.map((e) => ({
      id: e.course.id,
      title: e.course.title,
      description: e.course.description,
      teacherId: e.course.teacherId,
      createdAt: e.course.createdAt.toISOString(),
    }));
  }

  /**
   * Get course enrollments (all student IDs in course)
   */
  async getCourseEnrollments(courseId: string): Promise<string[]> {
    const enrollments = await db.enrollment.findMany({
      where: { courseId },
      select: { studentId: true },
    });

    return enrollments.map((e) => e.studentId);
  }
}

export const enrollmentService = new EnrollmentService();
