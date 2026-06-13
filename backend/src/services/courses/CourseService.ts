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

    if (course.teacherId !== teacherId) {
      throw errors.forbidden("You are not authorized to delete this course");
    }

    await db.course.delete({
      where: { id: courseId },
    });
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
