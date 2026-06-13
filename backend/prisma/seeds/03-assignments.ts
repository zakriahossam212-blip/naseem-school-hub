/**
 * Seed script for Assignment data
 * Creates assignments for courses
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedAssignments() {
  console.log('Seeding assignments...');

  const assignments = [
    {
      id: 'assign-001',
      courseId: 'course-001',
      title: 'TypeScript Exercises Part 1',
      description: 'Complete the TypeScript exercises from lesson 1',
      dueDate: new Date('2026-06-20'),
      maxGrade: 100,
      createdBy: 'teacher-001',
      attachmentUrl: 'https://example.com/assignment1.pdf',
    },
    {
      id: 'assign-002',
      courseId: 'course-001',
      title: 'Build a TypeScript Project',
      description: 'Build a small project using TypeScript',
      dueDate: new Date('2026-06-27'),
      maxGrade: 100,
      createdBy: 'teacher-001',
      attachmentUrl: 'https://example.com/assignment2.pdf',
    },
    {
      id: 'assign-003',
      courseId: 'course-002',
      title: 'React Components Challenge',
      description: 'Build reusable React components',
      dueDate: new Date('2026-06-25'),
      maxGrade: 100,
      createdBy: 'teacher-002',
      attachmentUrl: 'https://example.com/assignment3.pdf',
    },
    {
      id: 'assign-004',
      courseId: 'course-003',
      title: 'Database Schema Design',
      description: 'Design a database schema for an e-commerce app',
      dueDate: new Date('2026-06-28'),
      maxGrade: 100,
      createdBy: 'teacher-003',
      attachmentUrl: 'https://example.com/assignment4.pdf',
    },
  ];

  for (const assignment of assignments) {
    await prisma.assignment.upsert({
      where: { id: assignment.id },
      update: {},
      create: assignment,
    });
  }

  console.log('✅ Assignments seeded successfully');
}
