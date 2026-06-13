/**
 * Seed script for Profile data
 * Creates test users with different roles
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedProfiles() {
  console.log('Seeding profiles...');

  // Admin user
  await prisma.profile.upsert({
    where: { userId: 'admin-001' },
    update: {},
    create: {
      userId: 'admin-001',
      fullName: 'Admin User',
      role: 'ADMIN',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    },
  });

  // Teachers
  const teachers = [
    { userId: 'teacher-001', fullName: 'Dr. Ahmed Hassan', role: 'TEACHER' },
    { userId: 'teacher-002', fullName: 'Ms. Fatima Al-Mansouri', role: 'TEACHER' },
    { userId: 'teacher-003', fullName: 'Mr. Omar Al-Dosari', role: 'TEACHER' },
  ];

  for (const teacher of teachers) {
    await prisma.profile.upsert({
      where: { userId: teacher.userId },
      update: {},
      create: {
        ...teacher,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.userId}`,
      },
    });
  }

  // Students
  const students = [
    { userId: 'student-001', fullName: 'Ali Mohammed', role: 'STUDENT' },
    { userId: 'student-002', fullName: 'Sarah Al-Qurashi', role: 'STUDENT' },
    { userId: 'student-003', fullName: 'Noor Al-Rashid', role: 'STUDENT' },
    { userId: 'student-004', fullName: 'Hassan Al-Shammari', role: 'STUDENT' },
    { userId: 'student-005', fullName: 'Layla Al-Harbi', role: 'STUDENT' },
  ];

  for (const student of students) {
    await prisma.profile.upsert({
      where: { userId: student.userId },
      update: {},
      create: {
        ...student,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.userId}`,
      },
    });
  }

  // Parents
  const parents = [
    { userId: 'parent-001', fullName: 'Mr. Mohammed Ali', role: 'PARENT' },
    { userId: 'parent-002', fullName: 'Mrs. Amira Abdullah', role: 'PARENT' },
    { userId: 'parent-003', fullName: 'Mr. Saleh Al-Dosari', role: 'PARENT' },
  ];

  for (const parent of parents) {
    await prisma.profile.upsert({
      where: { userId: parent.userId },
      update: {},
      create: {
        ...parent,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${parent.userId}`,
      },
    });
  }

  console.log('✅ Profiles seeded successfully');
}
