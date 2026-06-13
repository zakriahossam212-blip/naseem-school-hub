import { AssignmentService } from '@/services/assignments';
import { SubmissionService } from '@/services/assignments';
import { GradingService } from '@/services/assignments';
import { mockPrisma, resetMocks } from '../mocks/db.mock';

jest.mock('@/utils/db', () => ({
  db: mockPrisma,
}));

describe('AssignmentService', () => {
  let assignmentService: AssignmentService;

  beforeEach(() => {
    resetMocks();
    assignmentService = new AssignmentService();
  });

  describe('createAssignment', () => {
    it('should create assignment', async () => {
      const courseId = 'course-123';
      const teacherId = 'teacher-123';

      mockPrisma.course.findUnique.mockResolvedValue({ teacherId, id: courseId });
      mockPrisma.assignment.create.mockResolvedValue({
        id: 'assignment-1',
        courseId,
        title: 'Homework 1',
        description: null,
        dueDate: null,
        maxGrade: 100,
        attachmentUrl: null,
        createdBy: teacherId,
        createdAt: new Date(),
      });

      const result = await assignmentService.createAssignment(courseId, teacherId, {
        title: 'Homework 1',
      });

      expect(result.title).toBe('Homework 1');
    });

    it('should throw if course not found', async () => {
      mockPrisma.course.findUnique.mockResolvedValue(null);

      await expect(
        assignmentService.createAssignment('course-123', 'teacher-123', { title: 'HW' })
      ).rejects.toThrow('Course not found');
    });
  });

  describe('listAssignments', () => {
    it('should list assignments', async () => {
      const assignments = [
        { id: '1', courseId: 'course-1', title: 'HW1', createdAt: new Date() },
      ];

      mockPrisma.assignment.findMany.mockResolvedValue(assignments);

      const result = await assignmentService.listAssignments('course-1');

      expect(result).toHaveLength(1);
    });
  });
});

describe('SubmissionService', () => {
  let submissionService: SubmissionService;

  beforeEach(() => {
    resetMocks();
    submissionService = new SubmissionService();
  });

  describe('submitAssignment', () => {
    it('should submit assignment', async () => {
      mockPrisma.assignment.findUnique.mockResolvedValue({ id: 'assignment-1' });
      mockPrisma.submission.findUnique.mockResolvedValue(null);
      mockPrisma.submission.create.mockResolvedValue({
        id: 'submission-1',
        assignmentId: 'assignment-1',
        studentId: 'student-1',
        content: 'My answer',
        fileUrl: null,
        grade: null,
        feedback: null,
        status: 'SUBMITTED',
        submittedAt: new Date(),
      });

      const result = await submissionService.submitAssignment('assignment-1', 'student-1', {
        content: 'My answer',
      });

      expect(result.content).toBe('My answer');
    });
  });
});

describe('GradingService', () => {
  let gradingService: GradingService;

  beforeEach(() => {
    resetMocks();
    gradingService = new GradingService();
  });

  describe('gradeSubmission', () => {
    it('should grade submission', async () => {
      mockPrisma.submission.findUnique.mockResolvedValue({
        id: 'submission-1',
        assignment: { createdBy: 'teacher-1' },
      });
      mockPrisma.submission.update.mockResolvedValue({
        id: 'submission-1',
        grade: 85,
        status: 'GRADED',
      });

      const result = await gradingService.gradeSubmission('submission-1', 'teacher-1', {
        grade: 85,
      });

      expect(result.grade).toBe(85);
    });
  });
});
