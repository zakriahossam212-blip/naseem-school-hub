/**
 * Seed script for Schedule data
 * Creates class schedule entries
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedSchedule() {
  console.log('Seeding schedule...');

  const scheduleEntries = [
    // TypeScript course - Monday & Wednesday
    {
      id: 'schedule-001',
      courseId: 'course-001',
      eventName: 'TypeScript Lecture',
      eventType: 'LECTURE',
      startTime: '09:00',
      endTime: '10:30',
      dayOfWeek: 1, // Monday
      description: 'Main lecture on TypeScript concepts',
      location: 'Room 101',
    },
    {
      id: 'schedule-002',
      courseId: 'course-001',
      eventName: 'TypeScript Lab',
      eventType: 'LAB',
      startTime: '11:00',
      endTime: '12:30',
      dayOfWeek: 3, // Wednesday
      description: 'Hands-on programming lab',
      location: 'Lab 205',
    },
    // React course - Tuesday & Thursday
    {
      id: 'schedule-003',
      courseId: 'course-002',
      eventName: 'React Lecture',
      eventType: 'LECTURE',
      startTime: '10:00',
      endTime: '11:30',
      dayOfWeek: 2, // Tuesday
      description: 'React fundamentals and patterns',
      location: 'Room 102',
    },
    {
      id: 'schedule-004',
      courseId: 'course-002',
      eventName: 'React Workshop',
      eventType: 'LAB',
      startTime: '14:00',
      endTime: '15:30',
      dayOfWeek: 4, // Thursday
      description: 'Practical React development workshop',
      location: 'Lab 206',
    },
    // Database course - Monday & Friday
    {
      id: 'schedule-005',
      courseId: 'course-003',
      eventName: 'Database Design Lecture',
      eventType: 'LECTURE',
      startTime: '13:00',
      endTime: '14:30',
      dayOfWeek: 1, // Monday
      description: 'Database design principles and PostgreSQL',
      location: 'Room 103',
    },
    {
      id: 'schedule-006',
      courseId: 'course-003',
      eventName: 'Database Lab',
      eventType: 'LAB',
      startTime: '10:00',
      endTime: '11:30',
      dayOfWeek: 5, // Friday
      description: 'SQL optimization and queries',
      location: 'Lab 207',
    },
  ];

  for (const entry of scheduleEntries) {
    await prisma.scheduleEntry.upsert({
      where: { id: entry.id },
      update: {},
      create: entry,
    });
  }

  console.log('✅ Schedule seeded successfully');
}
