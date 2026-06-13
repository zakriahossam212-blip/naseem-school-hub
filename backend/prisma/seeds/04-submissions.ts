/**
 * Seed script for Submission data
 * Creates student submissions and grades
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedSubmissions() {
  console.log('Seeding submissions...');

  const submissions = [
    {
      id: 'sub-001',
      assignmentId: 'assign-001',
      studentId: 'student-001',
      content: 'I completed all the exercises',
      fileUrl: 'https://example.com/student1-assign1.zip',
      grade: 95,
      feedback: 'Excellent work! Well done.',
      status: 'GRADED',
      gradedBy: 'teacher-001',
      submittedAt: new Date('2026-06-19'),
      gradedAt: new Date('2026-06-19'),
    },
    {
      id: 'sub-002',
      assignmentId: 'assign-001',
      studentId: 'student-002',
      content: 'Completed with some issues',
      fileUrl: 'https://example.com/student2-assign1.zip',
      grade: 80,
      feedback: 'Good effort, needs improvement in error handling',
      status: 'GRADED',
      gradedBy: 'teacher-001',
      submittedAt: new Date('2026-06-19'),
      gradedAt: new Date('2026-06-19'),
    },
    {
      id: 'sub-003',
      assignmentId: 'assign-002',
      studentId: 'student-001',
      content: 'Submitted TypeScript project',
      fileUrl: 'https://example.com/student1-project.zip',
      grade: null,
      feedback: null,
      status: 'SUBMITTED',
      gradedBy: null,
      submittedAt: new Date('2026-06-26'),
      gradedAt: null,
    },
    {
      id: 'sub-004',
      assignmentId: 'assign-003',
      studentId: 'student-003',
      content: 'React components completed',
      fileUrl: 'https://example.com/student3-components.zip',
      grade: 88,
      feedback: 'Nice component design, good use of hooks',
      status: 'GRADED',
      gradedBy: 'teacher-002',
      submittedAt: new Date('2026-06-24'),
      gradedAt: new Date('2026-06-24'),
    },
  ];

  for (const submission of submissions) {
    await prisma.submission.upsert({
      where: { id: submission.id },
      update: {},
      create: submission,
    });
  }

  console.log('✅ Submissions seeded successfully');
}
