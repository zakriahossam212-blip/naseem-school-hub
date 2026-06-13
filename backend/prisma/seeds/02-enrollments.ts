/**
 * Seed script for Enrollment data
 * Enrolls students in courses
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedEnrollments() {
  console.log('Seeding enrollments...');

  const enrollments = [
    { studentId: 'student-001', courseId: 'course-001' },
    { studentId: 'student-001', courseId: 'course-002' },
    { studentId: 'student-002', courseId: 'course-001' },
    { studentId: 'student-002', courseId: 'course-003' },
    { studentId: 'student-003', courseId: 'course-002' },
    { studentId: 'student-003', courseId: 'course-003' },
    { studentId: 'student-004', courseId: 'course-001' },
    { studentId: 'student-005', courseId: 'course-002' },
  ];

  for (const enrollment of enrollments) {
    await prisma.enrollment.upsert({
      where: {
        studentId_courseId: {
          studentId: enrollment.studentId,
          courseId: enrollment.courseId,
        },
      },
      update: {},
      create: enrollment,
    });
  }

  console.log('✅ Enrollments seeded successfully');
}
