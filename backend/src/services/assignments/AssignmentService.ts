import { db } from "@/utils/db";
import { errors } from "@/utils/errors";
import { AssignmentDto, CreateAssignmentRequest } from "@/types/index";

export class AssignmentService {
  /**
   * Create assignment for a course
   */
  async createAssignment(
    courseId: string,
    createdBy: string,
    data: CreateAssignmentRequest
  ): Promise<AssignmentDto> {
    const course = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      throw errors.notFound("Course not found");
    }

    if (course.teacherId !== createdBy) {
      throw errors.forbidden("Only course teacher can create assignments");
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
      throw errors.forbidden("Only assignment creator can delete it");
    }

    await db.assignment.delete({
      where: { id: assignmentId },
    });
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
}

export const assignmentService = new AssignmentService();
