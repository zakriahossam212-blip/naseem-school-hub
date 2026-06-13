import { db } from "@/utils/db";
import { errors } from "@/utils/errors";
import { CourseDto, CreateCourseRequest, UpdateCourseRequest } from "@/types/index";

export class CourseService {
  /**
   * Create a new course
   */
  async createCourse(
    teacherId: string,
    data: CreateCourseRequest
  ): Promise<CourseDto> {
    // Verify teacher exists
    const teacher = await db.profile.findUnique({
      where: { userId: teacherId },
    });

    if (!teacher) {
      throw errors.notFound("Teacher profile not found");
    }

    const course = await db.course.create({
      data: {
        title: data.title,
        description: data.description || null,
        teacherId,
      },
    });

    return this.mapCourseToDto(course);
  }

  /**
   * Get course by ID
   */
  async getCourse(id: string): Promise<CourseDto> {
    const course = await db.course.findUnique({
      where: { id },
    });

    if (!course) {
      throw errors.notFound("Course not found");
    }

    return this.mapCourseToDto(course);
  }

  /**
   * List all courses or filter by teacher
   */
  async listCourses(teacherId?: string): Promise<CourseDto[]> {
    const courses = await db.course.findMany({
      where: teacherId ? { teacherId } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return courses.map((c) => this.mapCourseToDto(c));
  }

  /**
   * List courses for a student (enrolled)
   */
  async listStudentCourses(studentId: string): Promise<CourseDto[]> {
    const enrollments = await db.enrollment.findMany({
      where: { studentId },
      include: { course: true },
    });

    return enrollments.map((e) => this.mapCourseToDto(e.course));
  }

  /**
   * Update course
   */
  async updateCourse(
    courseId: string,
    teacherId: string,
    data: UpdateCourseRequest
  ): Promise<CourseDto> {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw errors.notFound("Course not found");
    }

    // Verify authorization
    if (course.teacherId !== teacherId) {
      throw errors.forbidden("You are not authorized to update this course");
    }

    const updated = await db.course.update({
      where: { id: courseId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
      },
    });

    return this.mapCourseToDto(updated);
  }

  /**
   * Delete course
   */
  async deleteCourse(courseId: string, teacherId: string): Promise<void> {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw errors.notFound("Course not found");
    }

    // Verify authorization
    if (course.teacherId !== teacherId) {
      throw errors.forbidden("You are not authorized to delete this course");
    }

    await db.course.delete({
      where: { id: courseId },
    });
  }

  /**
   * Enroll student in course
   */
  async enrollStudent(courseId: string, studentId: string): Promise<void> {
    // Verify course exists
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw errors.notFound("Course not found");
    }

    // Check if already enrolled
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
   * Get student enrollments
   */
  async getStudentEnrollments(studentId: string): Promise<string[]> {
    const enrollments = await db.enrollment.findMany({
      where: { studentId },
      select: { courseId: true },
    });

    return enrollments.map((e) => e.courseId);
  }

  /**
   * Get course enrollments (all students)
   */
  async getCourseEnrollments(courseId: string): Promise<string[]> {
    const enrollments = await db.enrollment.findMany({
      where: { courseId },
      select: { studentId: true },
    });

    return enrollments.map((e) => e.studentId);
  }

  private mapCourseToDto(course: any): CourseDto {
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      teacherId: course.teacherId,
      createdAt: course.createdAt.toISOString(),
    };
  }
}

export const courseService = new CourseService();
