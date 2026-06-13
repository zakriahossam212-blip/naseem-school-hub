import { PrismaClient } from '@prisma/client';
import { BaseRepository } from '../BaseRepository';
import { EnrollmentDto } from '@/types';

/**
 * EnrollmentRepository handles all enrollment-related database operations
 */
export class EnrollmentRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Create new enrollment
   */
  async create(data: {
    courseId: string;
    studentId: string;
  }): Promise<EnrollmentDto> {
    try {
      const enrollment = await this.prisma.enrollment.create({
        data,
      });
      return this.mapToDto(enrollment);
    } catch (error) {
      this.handleError(error, 'Failed to create enrollment');
    }
  }

  /**
   * Get enrollment by ID
   */
  async findById(id: string): Promise<EnrollmentDto | null> {
    this.validateId(id, 'Enrollment ID');
    try {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: { id },
      });
      return enrollment ? this.mapToDto(enrollment) : null;
    } catch (error) {
      this.handleError(error, 'Failed to fetch enrollment');
    }
  }

  /**
   * Get student enrollments in a course
   */
  async findByStudentAndCourse(
    studentId: string,
    courseId: string
  ): Promise<EnrollmentDto | null> {
    this.validateId(studentId, 'Student ID');
    this.validateId(courseId, 'Course ID');
    try {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId,
            courseId,
          },
        },
      });
      return enrollment ? this.mapToDto(enrollment) : null;
    } catch (error) {
      this.handleError(error, 'Failed to fetch enrollment');
    }
  }

  /**
   * Get all courses for a student
   */
  async findByStudent(studentId: string): Promise<EnrollmentDto[]> {
    this.validateId(studentId, 'Student ID');
    try {
      const enrollments = await this.prisma.enrollment.findMany({
        where: { studentId },
        include: { course: true },
        orderBy: { enrolledAt: 'desc' },
      });
      return enrollments.map(e => this.mapToDto(e));
    } catch (error) {
      this.handleError(error, 'Failed to fetch student enrollments');
    }
  }

  /**
   * Get all students in a course
   */
  async findByCourse(courseId: string): Promise<EnrollmentDto[]> {
    this.validateId(courseId, 'Course ID');
    try {
      const enrollments = await this.prisma.enrollment.findMany({
        where: { courseId },
        include: { student: true },
        orderBy: { enrolledAt: 'asc' },
      });
      return enrollments.map(e => this.mapToDto(e));
    } catch (error) {
      this.handleError(error, 'Failed to fetch course enrollments');
    }
  }

  /**
   * Remove enrollment
   */
  async delete(id: string): Promise<void> {
    this.validateId(id, 'Enrollment ID');
    try {
      await this.prisma.enrollment.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error, 'Failed to delete enrollment');
    }
  }

  /**
   * Check if student is enrolled in course
   */
  async isEnrolled(studentId: string, courseId: string): Promise<boolean> {
    this.validateId(studentId, 'Student ID');
    this.validateId(courseId, 'Course ID');
    try {
      const enrollment = await this.prisma.enrollment.findUnique({
        where: {
          studentId_courseId: {
            studentId,
            courseId,
          },
        },
      });
      return !!enrollment;
    } catch {
      return false;
    }
  }

  /**
   * Get enrollment count for a course
   */
  async countByCourse(courseId: string): Promise<number> {
    this.validateId(courseId, 'Course ID');
    try {
      return await this.prisma.enrollment.count({
        where: { courseId },
      });
    } catch (error) {
      this.handleError(error, 'Failed to count enrollments');
    }
  }

  /**
   * Map database Enrollment to EnrollmentDto
   */
  private mapToDto(enrollment: any): EnrollmentDto {
    return {
      id: enrollment.id,
      courseId: enrollment.courseId,
      studentId: enrollment.studentId,
      enrolledAt: enrollment.enrolledAt,
    };
  }
}
