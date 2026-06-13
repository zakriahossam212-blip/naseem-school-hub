import { db } from "@/utils/db";
import { errors } from "@/utils/errors";
import {
  AssignmentDto,
  SubmissionDto,
  CreateAssignmentRequest,
  CreateSubmissionRequest,
  GradeSubmissionRequest,
  GradeDto,
} from "@/types/index";

export class AssignmentService {
  /**
   * Create assignment for a course
   */
  async createAssignment(
    courseId: string,
    createdBy: string,
    data: CreateAssignmentRequest
  ): Promise<AssignmentDto> {
    // Verify course exists and user is teacher
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw errors.notFound("Course not found");
    }

    if (course.teacherId !== createdBy) {
      throw errors.forbidden(
        "Only course teacher can create assignments"
      );
    }

    const assignment = await db.assignment.create({
      data: {
        courseId,
        title: data.title,
        description: data.description || null,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        maxGrade: data.maxGrade || 100,
        createdBy,
      },
    });

    return this.mapAssignmentToDto(assignment);
  }

  /**
   * Get assignment by ID
   */
  async getAssignment(id: string): Promise<AssignmentDto> {
    const assignment = await db.assignment.findUnique({
      where: { id },
    });

    if (!assignment) {
      throw errors.notFound("Assignment not found");
    }

    return this.mapAssignmentToDto(assignment);
  }

  /**
   * List assignments for a course
   */
  async listAssignments(courseId?: string): Promise<AssignmentDto[]> {
    const assignments = await db.assignment.findMany({
      where: courseId ? { courseId } : undefined,
      orderBy: { createdAt: "desc" },
    });

    return assignments.map((a) => this.mapAssignmentToDto(a));
  }

  /**
   * Delete assignment
   */
  async deleteAssignment(
    assignmentId: string,
    userId: string
  ): Promise<void> {
    const assignment = await db.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw errors.notFound("Assignment not found");
    }

    if (assignment.createdBy !== userId) {
      throw errors.forbidden(
        "Only assignment creator can delete it"
      );
    }

    await db.assignment.delete({
      where: { id: assignmentId },
    });
  }

  /**
   * Submit assignment
   */
  async submitAssignment(
    assignmentId: string,
    studentId: string,
    data: CreateSubmissionRequest
  ): Promise<SubmissionDto> {
    // Verify assignment exists
    const assignment = await db.assignment.findUnique({
      where: { id: assignmentId },
    });

    if (!assignment) {
      throw errors.notFound("Assignment not found");
    }

    // Check if already submitted
    const existing = await db.submission.findUnique({
      where: { assignmentId_studentId: { assignmentId, studentId } },
    });

    if (existing) {
      // Update existing submission
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

    // Create new submission
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

    // Verify teacher owns the course
    if (submission.assignment.createdBy !== teacherId) {
      throw errors.forbidden(
        "Only course teacher can grade submissions"
      );
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
   * Get grades for a student (parent portal view)
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

  private mapAssignmentToDto(assignment: any): AssignmentDto {
    return {
      id: assignment.id,
      courseId: assignment.courseId,
      title: assignment.title,
      description: assignment.description,
      dueDate: assignment.dueDate ? assignment.dueDate.toISOString() : null,
      maxGrade: assignment.maxGrade,
      attachmentUrl: assignment.attachmentUrl,
      createdBy: assignment.createdBy,
      createdAt: assignment.createdAt.toISOString(),
    };
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

export const assignmentService = new AssignmentService();
