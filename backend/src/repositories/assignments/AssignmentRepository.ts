import { PrismaClient, Assignment } from '@prisma/client';
import { BaseRepository } from '../BaseRepository';
import { AssignmentDto } from '@/types';

/**
 * AssignmentRepository handles all assignment-related database operations
 */
export class AssignmentRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Create new assignment
   */
  async create(data: {
    courseId: string;
    title: string;
    description: string;
    dueDate: Date;
    points: number;
    instructions?: string;
  }): Promise<AssignmentDto> {
    try {
      const assignment = await this.prisma.assignment.create({
        data,
      });
      return this.mapToDto(assignment);
    } catch (error) {
      this.handleError(error, 'Failed to create assignment');
    }
  }

  /**
   * Get assignment by ID
   */
  async findById(id: string): Promise<AssignmentDto | null> {
    this.validateId(id, 'Assignment ID');
    try {
      const assignment = await this.prisma.assignment.findUnique({
        where: { id },
        include: { course: true },
      });
      return assignment ? this.mapToDto(assignment as any) : null;
    } catch (error) {
      this.handleError(error, 'Failed to fetch assignment');
    }
  }

  /**
   * Get all assignments for a course
   */
  async findByCourse(courseId: string): Promise<AssignmentDto[]> {
    this.validateId(courseId, 'Course ID');
    try {
      const assignments = await this.prisma.assignment.findMany({
        where: { courseId },
        orderBy: { dueDate: 'asc' },
      });
      return assignments.map(a => this.mapToDto(a));
    } catch (error) {
      this.handleError(error, 'Failed to fetch assignments');
    }
  }

  /**
   * Get all assignments
   */
  async findAll(): Promise<AssignmentDto[]> {
    try {
      const assignments = await this.prisma.assignment.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return assignments.map(a => this.mapToDto(a));
    } catch (error) {
      this.handleError(error, 'Failed to fetch all assignments');
    }
  }

  /**
   * Update assignment
   */
  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      dueDate: Date;
      points: number;
      instructions: string;
    }>
  ): Promise<AssignmentDto> {
    this.validateId(id, 'Assignment ID');
    try {
      const assignment = await this.prisma.assignment.update({
        where: { id },
        data,
      });
      return this.mapToDto(assignment);
    } catch (error) {
      this.handleError(error, 'Failed to update assignment');
    }
  }

  /**
   * Delete assignment
   */
  async delete(id: string): Promise<void> {
    this.validateId(id, 'Assignment ID');
    try {
      await this.prisma.assignment.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error, 'Failed to delete assignment');
    }
  }

  /**
   * Get submission count for assignment
   */
  async getSubmissionCount(assignmentId: string): Promise<number> {
    this.validateId(assignmentId, 'Assignment ID');
    try {
      return await this.prisma.submission.count({
        where: { assignmentId },
      });
    } catch (error) {
      this.handleError(error, 'Failed to count submissions');
    }
  }

  /**
   * Map database Assignment to AssignmentDto
   */
  private mapToDto(assignment: any): AssignmentDto {
    return {
      id: assignment.id,
      courseId: assignment.courseId,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate,
      points: assignment.points,
      instructions: assignment.instructions || undefined,
      createdAt: assignment.createdAt,
      updatedAt: assignment.updatedAt,
    };
  }
}
