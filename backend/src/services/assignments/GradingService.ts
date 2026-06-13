import { db } from "@/utils/db";
import { errors } from "@/utils/errors";
import { SubmissionDto, GradeDto, GradeSubmissionRequest } from "@/types/index";

export class GradingService {
  /**
   * Grade submission
   */
  async gradeSubmission(
    submissionId: string,
    teacherId: string,
    data: GradeSubmissionRequest
  ): Promise<SubmissionDto> {
    const submission = await db.submission.findUnique({
      where: { id: submissionId },
      include: { assignment: true },
    });

    if (!submission) {
      throw errors.notFound("Submission not found");
    }

    if (submission.assignment.createdBy !== teacherId) {
      throw errors.forbidden("Only course teacher can grade submissions");
    }

    const updated = await db.submission.update({
      where: { id: submissionId },
      data: {
        grade: data.grade,
        feedback: data.feedback || null,
        status: "GRADED",
        gradedBy: teacherId,
        gradedAt: new Date(),
      },
    });

    return this.mapSubmissionToDto(updated);
  }

  /**
   * Get student grades (for parent/student view)
   */
  async getStudentGrades(studentId: string): Promise<GradeDto[]> {
    const submissions = await db.submission.findMany({
      where: { studentId },
      include: { assignment: { include: { course: true } } },
      orderBy: { submittedAt: "desc" },
    });

    return submissions.map((s) => ({
      id: s.id,
      assignmentId: s.assignmentId,
      assignmentTitle: s.assignment.title,
      courseTitle: s.assignment.course.title,
      grade: s.grade,
      maxGrade: s.assignment.maxGrade,
      status: s.status,
      feedback: s.feedback,
      submittedAt: s.submittedAt.toISOString(),
    }));
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

export const gradingService = new GradingService();
