import { db } from "@/utils/db";
import { errors } from "@/utils/errors";
import { LessonDto, CreateLessonRequest, UpdateLessonRequest } from "@/types/index";

export class LessonService {
  /**
   * Create lesson in course
   */
  async createLesson(
    courseId: string,
    createdBy: string,
    data: CreateLessonRequest
  ): Promise<LessonDto> {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw errors.notFound("Course not found");
    }

    if (course.teacherId !== createdBy) {
      throw errors.forbidden("Only course teacher can create lessons");
    }

    const lesson = await db.lesson.create({
      data: {
        courseId,
        title: data.title,
        content: data.content || null,
        videoUrl: data.videoUrl || null,
        orderIndex: data.orderIndex || 0,
        createdBy,
      },
    });

    return this.mapLessonToDto(lesson);
  }

  /**
   * Get lesson by ID
   */
  async getLesson(id: string): Promise<LessonDto> {
    const lesson = await db.lesson.findUnique({
      where: { id },
    });

    if (!lesson) {
      throw errors.notFound("Lesson not found");
    }

    return this.mapLessonToDto(lesson);
  }

  /**
   * List lessons for course
   */
  async listLessons(courseId: string): Promise<LessonDto[]> {
    const lessons = await db.lesson.findMany({
      where: { courseId },
      orderBy: { orderIndex: "asc" },
    });

    return lessons.map((l) => this.mapLessonToDto(l));
  }

  /**
   * Update lesson
   */
  async updateLesson(
    lessonId: string,
    userId: string,
    data: UpdateLessonRequest
  ): Promise<LessonDto> {
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw errors.notFound("Lesson not found");
    }

    if (lesson.createdBy !== userId) {
      throw errors.forbidden("Only lesson creator can update it");
    }

    const updated = await db.lesson.update({
      where: { id: lessonId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.videoUrl !== undefined && { videoUrl: data.videoUrl }),
        ...(data.orderIndex !== undefined && { orderIndex: data.orderIndex }),
      },
    });

    return this.mapLessonToDto(updated);
  }

  /**
   * Delete lesson
   */
  async deleteLesson(lessonId: string, userId: string): Promise<void> {
    const lesson = await db.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw errors.notFound("Lesson not found");
    }

    if (lesson.createdBy !== userId) {
      throw errors.forbidden("Only lesson creator can delete it");
    }

    await db.lesson.delete({
      where: { id: lessonId },
    });
  }

  private mapLessonToDto(lesson: any): LessonDto {
    return {
      id: lesson.id,
      courseId: lesson.courseId,
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
      orderIndex: lesson.orderIndex,
      createdBy: lesson.createdBy,
      createdAt: lesson.createdAt.toISOString(),
    };
  }
}

export const lessonService = new LessonService();
