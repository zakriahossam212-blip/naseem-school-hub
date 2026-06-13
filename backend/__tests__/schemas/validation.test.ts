import { ensureProfileSchema } from '@/schemas/auth/ensureProfile';
import { updateProfileSchema } from '@/schemas/auth/updateProfile';
import { createCourseSchema, enrollCourseSchema } from '@/schemas/courses';
import { createAssignmentSchema, submitAssignmentSchema, gradeAssignmentSchema } from '@/schemas/assignments';
import { sendMessageSchema } from '@/schemas/messages';
import { createScheduleSchema, updateScheduleSchema } from '@/schemas/schedule';

describe('Zod Validation Schemas', () => {
  describe('Auth Schemas', () => {
    describe('ensureProfileSchema', () => {
      it('should validate a valid profile', () => {
        const validData = {
          userId: 'user123',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'STUDENT',
        };

        const result = ensureProfileSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject invalid role', () => {
        const invalidData = {
          userId: 'user123',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'INVALID_ROLE',
        };

        const result = ensureProfileSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should reject invalid email', () => {
        const invalidData = {
          userId: 'user123',
          name: 'John Doe',
          email: 'not-an-email',
          role: 'STUDENT',
        };

        const result = ensureProfileSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('updateProfileSchema', () => {
      it('should validate a valid profile update', () => {
        const validData = {
          name: 'Jane Doe',
          email: 'jane@example.com',
        };

        const result = updateProfileSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should allow partial updates', () => {
        const partialData = {
          name: 'Jane Doe',
        };

        const result = updateProfileSchema.safeParse(partialData);
        expect(result.success).toBe(true);
      });

      it('should reject invalid email in update', () => {
        const invalidData = {
          email: 'invalid-email',
        };

        const result = updateProfileSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Course Schemas', () => {
    describe('createCourseSchema', () => {
      it('should validate a valid course', () => {
        const validData = {
          title: 'Introduction to TypeScript',
          description: 'Learn TypeScript from basics',
          instructorId: 'instructor1',
          code: 'TS101',
        };

        const result = createCourseSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject course without title', () => {
        const invalidData = {
          description: 'Learn TypeScript from basics',
          instructorId: 'instructor1',
          code: 'TS101',
        };

        const result = createCourseSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should enforce minimum title length', () => {
        const invalidData = {
          title: 'TS',
          description: 'Learn TypeScript from basics',
          instructorId: 'instructor1',
          code: 'TS101',
        };

        const result = createCourseSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('enrollCourseSchema', () => {
      it('should validate valid enrollment', () => {
        const validData = {
          courseId: 'course1',
          studentId: 'student1',
        };

        const result = enrollCourseSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should require both courseId and studentId', () => {
        const invalidData = {
          courseId: 'course1',
        };

        const result = enrollCourseSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Assignment Schemas', () => {
    describe('createAssignmentSchema', () => {
      it('should validate a valid assignment', () => {
        const validData = {
          courseId: 'course1',
          title: 'TypeScript Basics',
          description: 'Learn the basics of TypeScript',
          dueDate: '2026-12-31',
          points: 100,
        };

        const result = createAssignmentSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject negative points', () => {
        const invalidData = {
          courseId: 'course1',
          title: 'TypeScript Basics',
          description: 'Learn the basics',
          dueDate: '2026-12-31',
          points: -10,
        };

        const result = createAssignmentSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should reject invalid date format', () => {
        const invalidData = {
          courseId: 'course1',
          title: 'TypeScript Basics',
          description: 'Learn the basics',
          dueDate: 'not-a-date',
          points: 100,
        };

        const result = createAssignmentSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('submitAssignmentSchema', () => {
      it('should validate a valid submission', () => {
        const validData = {
          assignmentId: 'assign1',
          studentId: 'student1',
          submissionText: 'My solution here',
          attachmentUrl: 'https://example.com/submission.pdf',
        };

        const result = submitAssignmentSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should allow submission without attachment', () => {
        const validData = {
          assignmentId: 'assign1',
          studentId: 'student1',
          submissionText: 'My solution here',
        };

        const result = submitAssignmentSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject invalid URL', () => {
        const invalidData = {
          assignmentId: 'assign1',
          studentId: 'student1',
          submissionText: 'My solution',
          attachmentUrl: 'not-a-url',
        };

        const result = submitAssignmentSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('gradeAssignmentSchema', () => {
      it('should validate a valid grade submission', () => {
        const validData = {
          submissionId: 'sub1',
          grade: 85,
          feedback: 'Good work, needs improvement in X',
        };

        const result = gradeAssignmentSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject grade outside valid range', () => {
        const invalidData = {
          submissionId: 'sub1',
          grade: 105,
          feedback: 'Good work',
        };

        const result = gradeAssignmentSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should reject negative grade', () => {
        const invalidData = {
          submissionId: 'sub1',
          grade: -5,
          feedback: 'Poor work',
        };

        const result = gradeAssignmentSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Message Schema', () => {
    describe('sendMessageSchema', () => {
      it('should validate a valid message', () => {
        const validData = {
          senderId: 'user1',
          recipientId: 'user2',
          subject: 'Meeting Tomorrow',
          body: 'We have a meeting tomorrow at 10 AM',
        };

        const result = sendMessageSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should allow message with attachment', () => {
        const validData = {
          senderId: 'user1',
          recipientId: 'user2',
          subject: 'Document Review',
          body: 'Please review the attached document',
          attachmentUrl: 'https://example.com/doc.pdf',
        };

        const result = sendMessageSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject empty subject', () => {
        const invalidData = {
          senderId: 'user1',
          recipientId: 'user2',
          subject: '',
          body: 'Message body',
        };

        const result = sendMessageSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should reject empty body', () => {
        const invalidData = {
          senderId: 'user1',
          recipientId: 'user2',
          subject: 'Subject',
          body: '',
        };

        const result = sendMessageSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });
  });

  describe('Schedule Schemas', () => {
    describe('createScheduleSchema', () => {
      it('should validate a valid schedule entry', () => {
        const validData = {
          courseId: 'course1',
          eventName: 'Class Lecture',
          eventType: 'LECTURE',
          startTime: '09:00',
          endTime: '10:30',
          dayOfWeek: 1,
        };

        const result = createScheduleSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should reject invalid time format', () => {
        const invalidData = {
          courseId: 'course1',
          eventName: 'Class Lecture',
          eventType: 'LECTURE',
          startTime: '25:00',
          endTime: '10:30',
          dayOfWeek: 1,
        };

        const result = createScheduleSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });

      it('should reject invalid dayOfWeek', () => {
        const invalidData = {
          courseId: 'course1',
          eventName: 'Class Lecture',
          eventType: 'LECTURE',
          startTime: '09:00',
          endTime: '10:30',
          dayOfWeek: 8,
        };

        const result = createScheduleSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
      });
    });

    describe('updateScheduleSchema', () => {
      it('should validate a valid update', () => {
        const validData = {
          eventName: 'Updated Lecture',
          startTime: '10:00',
        };

        const result = updateScheduleSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });

      it('should allow partial updates', () => {
        const validData = {
          eventName: 'New Name',
        };

        const result = updateScheduleSchema.safeParse(validData);
        expect(result.success).toBe(true);
      });
    });
  });
});
