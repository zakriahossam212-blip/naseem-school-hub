import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../BaseRepository';
import { CourseDto } from '@/types';

/**
 * CourseRepository handles all course-related database operations
 */
export class CourseRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Create a new course
   */
  async create(data: {
    title: string;
    description: string;
    instructorId: string;
    code: string;
    credits?: number;
  }): Promise<CourseDto> {
    try {
      const course = await this.prisma.course.create({
        data,
      });
      return this.mapToDto(course);
    } catch (error) {
      this.handleError(error, 'Failed to create course');
    }
  }

  /**
   * Get course by ID
   */
  async findById(id: string): Promise<CourseDto | null> {
    this.validateId(id, 'Course ID');
    try {
      const course = await this.prisma.course.findUnique({
        where: { id },
        include: {
          instructor: true,
          enrollments: { select: { studentId: true } },
        },
      });
      return course ? this.mapToDto(course as any) : null;
    } catch (error) {
      this.handleError(error, 'Failed to fetch course');
    }
  }

  /**
   * Get course by code
   */
  async findByCode(code: string): Promise<CourseDto | null> {
    if (!code || code.trim() === '') {
      throw new Error('Course code is required');
    }
    try {
      const course = await this.prisma.course.findUnique({
        where: { code },
      });
      return course ? this.mapToDto(course) : null;
    } catch (error) {
      this.handleError(error, 'Failed to fetch course by code');
    }
  }

  /**
   * Get all courses
   */
  async findAll(instructorId?: string): Promise<CourseDto[]> {
    try {
      const courses = await this.prisma.course.findMany({
        where: instructorId ? { instructorId } : undefined,
        include: {
          instructor: true,
          enrollments: { select: { studentId: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return courses.map(c => this.mapToDto(c as any));
    } catch (error) {
      this.handleError(error, 'Failed to fetch courses');
    }
  }

  /**
   * Update course
   */
  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      credits: number;
    }>
  ): Promise<CourseDto> {
    this.validateId(id, 'Course ID');
    try {
      const course = await this.prisma.course.update({
        where: { id },
        data,
      });
      return this.mapToDto(course);
    } catch (error) {
      this.handleError(error, 'Failed to update course');
    }
  }

  /**
   * Delete course
   */
  async delete(id: string): Promise<void> {
    this.validateId(id, 'Course ID');
    try {
      await this.prisma.course.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error, 'Failed to delete course');
    }
  }

  /**
   * Get courses by instructor
   */
  async findByInstructor(instructorId: string): Promise<CourseDto[]> {
    this.validateId(instructorId, 'Instructor ID');
    try {
      const courses = await this.prisma.course.findMany({
        where: { instructorId },
        orderBy: { createdAt: 'desc' },
      });
      return courses.map(c => this.mapToDto(c));
    } catch (error) {
      this.handleError(error, 'Failed to fetch courses by instructor');
    }
  }

  /**
   * Get enrollment count for a course
   */
  async getEnrollmentCount(courseId: string): Promise<number> {
    this.validateId(courseId, 'Course ID');
    try {
      return await this.prisma.enrollment.count({
        where: { courseId },
      });
    } catch (error) {
      this.handleError(error, 'Failed to get enrollment count');
    }
  }

  /**
   * Map database Course to CourseDto
   */
  private mapToDto(course: any): CourseDto {
    return {
      id: course.id,
      title: course.title,
      description: course.description,
      teacherId: course.teacherId,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };
  }
}
