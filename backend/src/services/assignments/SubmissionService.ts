import { db } from "@/utils/db";
import { errors } from "@/utils/errors";
import { SubmissionDto, CreateSubmissionRequest } from "@/types/index";

export class SubmissionService {
  /**
   * Submit or update assignment submission
   */
  async submitAssignment(
    assignmentId: string,
    studentId: string,
    data: CreateSubmissionRequest
  ): Promise<SubmissionDto> {
    const assignment = await db.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw errors.notFound("Assignment not found");
    }

    const existing = await db.submission.findUnique({
      where: { assignmentId_studentId: { assignmentId, studentId } },
    });

    if (existing) {
      const updated = await db.submission.update({
        where: { id: existing.id },
        data: {
          content: data.content || existing.content,
          fileUrl: data.fileUrl || existing.fileUrl,
          submittedAt: new Date(),
        },
      });
      return this.mapSubmissionToDto(updated);
    }

    const submission = await db.submission.create({
      data: {
        assignmentId,
        studentId,
        content: data.content || null,
        fileUrl: data.fileUrl || null,
      },
    });

    return this.mapSubmissionToDto(submission);
  }

  /**
   * Get submissions for an assignment
   */
  async getSubmissions(assignmentId: string): Promise<SubmissionDto[]> {
    const submissions = await db.submission.findMany({
      where: { assignmentId },
      orderBy: { submittedAt: "desc" },
    });

    return submissions.map((s) => this.mapSubmissionToDto(s));
  }

  /**
   * Get student submission for assignment
   */
  async getStudentSubmission(
    assignmentId: string,
    studentId: string
  ): Promise<SubmissionDto | null> {
    const submission = await db.submission.findUnique({
      where: {
        assignmentId_studentId: { assignmentId, studentId },
      },
    });

    return submission ? this.mapSubmissionToDto(submission) : null;
  }

  private mapSubmissionToDto(submission: any): SubmissionDto {
    return {
      id: submission.id,
      assignmentId: submission.assignmentId,
      studentId: submission.studentId,
      content: submission.content,
      fileUrl: submission.fileUrl,
      grade: submission.grade,
      feedback: submission.feedback,
      status: submission.status,
      gradedBy: submission.gradedBy,
      gradedAt: submission.gradedAt ? submission.gradedAt.toISOString() : null,
      submittedAt: submission.submittedAt.toISOString(),
    };
  }
}

export const submissionService = new SubmissionService();
