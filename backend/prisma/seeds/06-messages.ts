/**
 * Seed script for Message data
 * Creates sample messages between users
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedMessages() {
  console.log('Seeding messages...');

  const messages = [
    {
      id: 'msg-001',
      senderId: 'teacher-001',
      recipientId: 'student-001',
      subject: 'Great Assignment Submission',
      body: 'Your TypeScript assignment was excellent. Keep up the good work!',
      isRead: true,
      createdAt: new Date('2026-06-19T10:00:00'),
    },
    {
      id: 'msg-002',
      senderId: 'student-001',
      recipientId: 'teacher-001',
      subject: 'Questions about Interfaces',
      body: 'I have some questions about TypeScript interfaces. Can we discuss?',
      isRead: false,
      createdAt: new Date('2026-06-18T14:30:00'),
    },
    {
      id: 'msg-003',
      senderId: 'teacher-002',
      recipientId: 'student-003',
      subject: 'Assignment Deadline Reminder',
      body: 'Reminder: React components assignment is due tomorrow.',
      isRead: true,
      createdAt: new Date('2026-06-24T16:00:00'),
    },
    {
      id: 'msg-004',
      senderId: 'parent-001',
      recipientId: 'teacher-001',
      subject: 'Inquiry about Course Progress',
      body: 'Hello, I wanted to check on my child\'s progress in TypeScript course.',
      isRead: false,
      createdAt: new Date('2026-06-17T09:00:00'),
    },
    {
      id: 'msg-005',
      senderId: 'admin-001',
      recipientId: 'student-001',
      subject: 'Account Verification',
      body: 'Please verify your email address to activate your account.',
      isRead: true,
      createdAt: new Date('2026-06-01T08:00:00'),
    },
  ];

  for (const message of messages) {
    await prisma.message.upsert({
      where: { id: message.id },
      update: {},
      create: message,
    });
  }

  console.log('✅ Messages seeded successfully');
}
