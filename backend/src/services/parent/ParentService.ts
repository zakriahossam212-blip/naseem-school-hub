import { db } from "@/utils/db";
import { errors } from "@/utils/errors";
import { ParentLinkResponse, StudentOverview, CourseDto } from "@/types/index";

export class ParentService {
  /**
   * Link student to parent account
   */
  async linkStudent(parentId: string, studentId: string): Promise<ParentLinkResponse> {
    const student = await db.profile.findUnique({
      where: { userId: studentId },
    });

    if (!student) {
      throw errors.notFound("Student not found");
    }

    const existing = await db.parentLink.findUnique({
      where: { parentId_studentId: { parentId, studentId } },
    });

    if (existing) {
      throw errors.conflict("Student already linked to this parent");
    }

    const link = await db.parentLink.create({
      data: { parentId, studentId },
    });

    return {
      id: link.id,
      parentId: link.parentId,
      studentId: link.studentId,
      studentName: student.fullName || "Student",
      createdAt: link.createdAt.toISOString(),
    };
  }

  /**
   * Get parent's linked students
   */
  async getLinkedStudents(parentId: string): Promise<ParentLinkResponse[]> {
    const links = await db.parentLink.findMany({
      where: { parentId },
      include: { student: true },
    });

    return links.map((link) => ({
      id: link.id,
      parentId: link.parentId,
      studentId: link.studentId,
      studentName: link.student.fullName || "Student",
      createdAt: link.createdAt.toISOString(),
    }));
  }

  /**
   * Get student overview for parent (courses and grades)
   */
  async getStudentOverview(parentId: string, studentId: string): Promise<StudentOverview> {
    const link = await db.parentLink.findUnique({
      where: { parentId_studentId: { parentId, studentId } },
    });

    if (!link) {
      throw errors.forbidden("You are not linked to this student");
    }

    const student = await db.profile.findUnique({
      where: { userId: studentId },
    });

    const enrollments = await db.enrollment.findMany({
      where: { studentId },
      include: { course: true },
    });

    const submissions = await db.submission.findMany({
      where: { studentId },
      include: { assignment: { include: { course: true } } },
      orderBy: { submittedAt: "desc" },
      take: 10,
    });

    const upcomingAssignments = await db.assignment.findMany({
      where: {
        course: {
          enrollments: { some: { studentId } },
        },
        dueDate: { gte: new Date() },
      },
      include: { course: true },
      orderBy: { dueDate: "asc" },
      take: 5,
    });

    return {
      studentId,
      studentName: student?.fullName || "Student",
      enrolledCourses: enrollments.map((e) => ({
        id: e.course.id,
        title: e.course.title,
        description: e.course.description,
        teacherId: e.course.teacherId,
        createdAt: e.course.createdAt.toISOString(),
      })),
      recentGrades: submissions.map((s) => ({
        id: s.id,
        assignmentId: s.assignmentId,
        assignmentTitle: s.assignment.title,
        courseTitle: s.assignment.course.title,
        grade: s.grade,
        maxGrade: s.assignment.maxGrade,
        status: s.status,
        feedback: s.feedback,
        submittedAt: s.submittedAt.toISOString(),
      })),
      upcomingAssignments: upcomingAssignments.map((a) => ({
        id: a.id,
        courseId: a.courseId,
        title: a.title,
        description: a.description,
        dueDate: a.dueDate?.toISOString() || null,
        maxGrade: a.maxGrade,
        attachmentUrl: a.attachmentUrl,
        createdBy: a.createdBy,
        createdAt: a.createdAt.toISOString(),
      })),
    };
  }

  /**
   * Get student's grades for parent view
   */
  async getStudentGrades(parentId: string, studentId: string) {
    const link = await db.parentLink.findUnique({
      where: { parentId_studentId: { parentId, studentId } },
    });

    if (!link) {
      throw errors.forbidden("You are not linked to this student");
    }

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
}

export const parentService = new ParentService();
