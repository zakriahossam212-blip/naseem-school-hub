/**
 * Seed script for Parent-Student Links
 * Links parents with their students
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedParentLinks() {
  console.log('Seeding parent-student links...');

  const parentLinks = [
    {
      parentId: 'parent-001',
      studentId: 'student-001',
    },
    {
      parentId: 'parent-001',
      studentId: 'student-002',
    },
    {
      parentId: 'parent-002',
      studentId: 'student-003',
    },
    {
      parentId: 'parent-002',
      studentId: 'student-004',
    },
    {
      parentId: 'parent-003',
      studentId: 'student-005',
    },
  ];

  for (const link of parentLinks) {
    await prisma.parentLink.upsert({
      where: {
        parentId_studentId: {
          parentId: link.parentId,
          studentId: link.studentId,
        },
      },
      update: {},
      create: link,
    });
  }

  console.log('✅ Parent-student links seeded successfully');
}
