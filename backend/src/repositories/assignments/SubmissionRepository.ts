import { PrismaClient, Submission } from '@prisma/client';
import { BaseRepository } from '../BaseRepository';
import { SubmissionDto } from '@/types';

/**
 * SubmissionRepository handles all submission-related database operations
 */
export class SubmissionRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Create new submission
   */
  async create(data: {
    assignmentId: string;
    studentId: string;
    submissionText: string;
    attachmentUrl?: string;
  }): Promise<SubmissionDto> {
    try {
      const submission = await this.prisma.submission.create({
        data: {
          ...data,
          submittedAt: new Date(),
        },
      });
      return this.mapToDto(submission);
    } catch (error) {
      this.handleError(error, 'Failed to create submission');
    }
  }

  /**
   * Get submission by ID
   */
  async findById(id: string): Promise<SubmissionDto | null> {
    this.validateId(id, 'Submission ID');
    try {
      const submission = await this.prisma.submission.findUnique({
        where: { id },
        include: {
          assignment: true,
          student: true,
        },
      });
      return submission ? this.mapToDto(submission as any) : null;
    } catch (error) {
      this.handleError(error, 'Failed to fetch submission');
    }
  }

  /**
   * Get student submission for an assignment
   */
  async findByStudentAndAssignment(
    studentId: string,
    assignmentId: string
  ): Promise<SubmissionDto | null> {
    this.validateId(studentId, 'Student ID');
    this.validateId(assignmentId, 'Assignment ID');
    try {
      const submission = await this.prisma.submission.findUnique({
        where: {
          studentId_assignmentId: {
            studentId,
            assignmentId,
          },
        },
      });
      return submission ? this.mapToDto(submission) : null;
    } catch (error) {
      this.handleError(error, 'Failed to fetch submission');
    }
  }

  /**
   * Get all submissions for an assignment
   */
  async findByAssignment(assignmentId: string): Promise<SubmissionDto[]> {
    this.validateId(assignmentId, 'Assignment ID');
    try {
      const submissions = await this.prisma.submission.findMany({
        where: { assignmentId },
        include: { student: true },
        orderBy: { submittedAt: 'desc' },
      });
      return submissions.map(s => this.mapToDto(s as any));
    } catch (error) {
      this.handleError(error, 'Failed to fetch submissions');
    }
  }

  /**
   * Get all submissions by a student
   */
  async findByStudent(studentId: string): Promise<SubmissionDto[]> {
    this.validateId(studentId, 'Student ID');
    try {
      const submissions = await this.prisma.submission.findMany({
        where: { studentId },
        include: { assignment: true },
        orderBy: { submittedAt: 'desc' },
      });
      return submissions.map(s => this.mapToDto(s as any));
    } catch (error) {
      this.handleError(error, 'Failed to fetch student submissions');
    }
  }

  /**
   * Update submission (for grading)
   */
  async update(
    id: string,
    data: Partial<{
      grade: number;
      feedback: string;
      gradedAt: Date;
    }>
  ): Promise<SubmissionDto> {
    this.validateId(id, 'Submission ID');
    try {
      const submission = await this.prisma.submission.update({
        where: { id },
        data,
      });
      return this.mapToDto(submission);
    } catch (error) {
      this.handleError(error, 'Failed to update submission');
    }
  }

  /**
   * Delete submission
   */
  async delete(id: string): Promise<void> {
    this.validateId(id, 'Submission ID');
    try {
      await this.prisma.submission.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error, 'Failed to delete submission');
    }
  }

  /**
   * Get graded submissions
   */
  async findGraded(): Promise<SubmissionDto[]> {
    try {
      const submissions = await this.prisma.submission.findMany({
        where: {
          grade: {
            not: null,
          },
        },
        orderBy: { gradedAt: 'desc' },
      });
      return submissions.map(s => this.mapToDto(s as any));
    } catch (error) {
      this.handleError(error, 'Failed to fetch graded submissions');
    }
  }

  /**
   * Get pending submissions
   */
  async findPending(): Promise<SubmissionDto[]> {
    try {
      const submissions = await this.prisma.submission.findMany({
        where: {
          grade: null,
        },
        orderBy: { submittedAt: 'asc' },
      });
      return submissions.map(s => this.mapToDto(s as any));
    } catch (error) {
      this.handleError(error, 'Failed to fetch pending submissions');
    }
  }

  /**
   * Map database Submission to SubmissionDto
   */
  private mapToDto(submission: any): SubmissionDto {
    return {
      id: submission.id,
      assignmentId: submission.assignmentId,
      studentId: submission.studentId,
      submissionText: submission.submissionText,
      attachmentUrl: submission.attachmentUrl || undefined,
      grade: submission.grade || undefined,
      feedback: submission.feedback || undefined,
      submittedAt: submission.submittedAt,
      gradedAt: submission.gradedAt || undefined,
      updatedAt: submission.updatedAt,
    };
  }
}
