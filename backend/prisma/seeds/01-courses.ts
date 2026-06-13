/**
 * Seed script for Course and Lesson data
 * Creates courses with lessons
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCourses() {
  console.log('Seeding courses...');

  // Create courses
  const course1 = await prisma.course.upsert({
    where: { id: 'course-001' },
    update: {},
    create: {
      id: 'course-001',
      title: 'Introduction to TypeScript',
      description: 'Learn the fundamentals of TypeScript programming language',
      teacherId: 'teacher-001',
    },
  });

  const course2 = await prisma.course.upsert({
    where: { id: 'course-002' },
    update: {},
    create: {
      id: 'course-002',
      title: 'React Fundamentals',
      description: 'Master React development for modern web applications',
      teacherId: 'teacher-002',
    },
  });

  const course3 = await prisma.course.upsert({
    where: { id: 'course-003' },
    update: {},
    create: {
      id: 'course-003',
      title: 'Database Design with PostgreSQL',
      description: 'Learn database design and SQL optimization techniques',
      teacherId: 'teacher-003',
    },
  });

  // Create lessons for TypeScript course
  const lessons1 = [
    {
      id: 'lesson-001',
      courseId: course1.id,
      title: 'TypeScript Basics',
      content: '# TypeScript Basics\n\nTypeScript is a superset of JavaScript...',
      videoUrl: 'https://www.youtube.com/embed/d56mG7DQqqM',
      orderIndex: 0,
      createdBy: 'teacher-001',
    },
    {
      id: 'lesson-002',
      courseId: course1.id,
      title: 'Interfaces and Types',
      content: '# Interfaces and Types\n\nDefining the structure of objects...',
      videoUrl: 'https://www.youtube.com/embed/nBoJI_d0K_A',
      orderIndex: 1,
      createdBy: 'teacher-001',
    },
  ];

  for (const lesson of lessons1) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: {},
      create: lesson,
    });
  }

  // Create lessons for React course
  const lessons2 = [
    {
      id: 'lesson-003',
      courseId: course2.id,
      title: 'React Hooks',
      content: '# React Hooks\n\nUnderstanding useState, useEffect...',
      videoUrl: 'https://www.youtube.com/embed/dpw9EHDh2bM',
      orderIndex: 0,
      createdBy: 'teacher-002',
    },
    {
      id: 'lesson-004',
      courseId: course2.id,
      title: 'State Management',
      content: '# State Management\n\nManaging complex state with Redux...',
      videoUrl: 'https://www.youtube.com/embed/0-S5a0eS84c',
      orderIndex: 1,
      createdBy: 'teacher-002',
    },
  ];

  for (const lesson of lessons2) {
    await prisma.lesson.upsert({
      where: { id: lesson.id },
      update: {},
      create: lesson,
    });
  }

  console.log('✅ Courses seeded successfully');
}
