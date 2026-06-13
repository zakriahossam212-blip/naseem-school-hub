import { ParentService } from '@/services/parent';
import { mockPrismaClient } from '../mocks/db.mock';

describe('ParentService', () => {
  let parentService: ParentService;

  beforeEach(() => {
    jest.clearAllMocks();
    parentService = new ParentService(mockPrismaClient);
  });

  describe('linkStudent', () => {
    it('should link a student to a parent successfully', async () => {
      const parentId = 'parent1';
      const studentId = 'student1';

      const mockLink = {
        id: 'link1',
        parentId,
        studentId,
        linkedAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.parentLink.create.mockResolvedValue(mockLink);
      mockPrismaClient.profile.findUnique.mockResolvedValue({
        id: studentId,
        userId: 'user1',
        role: 'STUDENT',
        name: 'John Doe',
      });

      const result = await parentService.linkStudent(parentId, studentId);

      expect(result).toBeDefined();
      expect(mockPrismaClient.parentLink.create).toHaveBeenCalledWith({
        data: { parentId, studentId },
      });
    });

    it('should throw error if student does not exist', async () => {
      const parentId = 'parent1';
      const studentId = 'nonexistent';

      mockPrismaClient.profile.findUnique.mockResolvedValue(null);

      await expect(parentService.linkStudent(parentId, studentId)).rejects.toThrow(
        'Student not found'
      );
    });

    it('should throw error if already linked', async () => {
      const parentId = 'parent1';
      const studentId = 'student1';

      mockPrismaClient.profile.findUnique.mockResolvedValue({
        id: studentId,
        userId: 'user1',
        role: 'STUDENT',
        name: 'John Doe',
      });

      mockPrismaClient.parentLink.create.mockRejectedValue(
        new Error('Student already linked to this parent')
      );

      await expect(parentService.linkStudent(parentId, studentId)).rejects.toThrow(
        'Student already linked to this parent'
      );
    });
  });

  describe('getLinkedStudents', () => {
    it('should retrieve all linked students for a parent', async () => {
      const parentId = 'parent1';

      const mockLinks = [
        {
          id: 'link1',
          parentId,
          studentId: 'student1',
          linkedAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'link2',
          parentId,
          studentId: 'student2',
          linkedAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaClient.parentLink.findMany.mockResolvedValue(mockLinks);

      const result = await parentService.getLinkedStudents(parentId);

      expect(result).toHaveLength(2);
      expect(mockPrismaClient.parentLink.findMany).toHaveBeenCalledWith({
        where: { parentId },
      });
    });

    it('should return empty array if no students linked', async () => {
      const parentId = 'parent1';
      mockPrismaClient.parentLink.findMany.mockResolvedValue([]);

      const result = await parentService.getLinkedStudents(parentId);

      expect(result).toEqual([]);
    });
  });

  describe('getStudentOverview', () => {
    it('should retrieve student overview for a parent', async () => {
      const parentId = 'parent1';
      const studentId = 'student1';

      mockPrismaClient.parentLink.findUnique.mockResolvedValue({
        id: 'link1',
        parentId,
        studentId,
        linkedAt: new Date(),
        updatedAt: new Date(),
      });

      mockPrismaClient.profile.findUnique.mockResolvedValue({
        id: studentId,
        userId: 'user1',
        role: 'STUDENT',
        name: 'John Doe',
        email: 'john@example.com',
      });

      mockPrismaClient.enrollment.findMany.mockResolvedValue([
        {
          id: 'enroll1',
          studentId,
          courseId: 'course1',
          enrolledAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const result = await parentService.getStudentOverview(parentId, studentId);

      expect(result).toBeDefined();
      expect(result.studentId).toBe(studentId);
    });

    it('should throw error if student not linked to parent', async () => {
      const parentId = 'parent1';
      const studentId = 'student1';

      mockPrismaClient.parentLink.findUnique.mockResolvedValue(null);

      await expect(parentService.getStudentOverview(parentId, studentId)).rejects.toThrow(
        'Student not linked to this parent'
      );
    });
  });

  describe('getStudentGrades', () => {
    it('should retrieve student grades for a parent', async () => {
      const parentId = 'parent1';
      const studentId = 'student1';

      mockPrismaClient.parentLink.findUnique.mockResolvedValue({
        id: 'link1',
        parentId,
        studentId,
        linkedAt: new Date(),
        updatedAt: new Date(),
      });

      const mockSubmissions = [
        {
          id: 'sub1',
          studentId,
          assignmentId: 'assign1',
          grade: 85,
          submittedAt: new Date(),
          gradedAt: new Date(),
          feedback: 'Good work',
        },
        {
          id: 'sub2',
          studentId,
          assignmentId: 'assign2',
          grade: 92,
          submittedAt: new Date(),
          gradedAt: new Date(),
          feedback: 'Excellent',
        },
      ];

      mockPrismaClient.submission.findMany.mockResolvedValue(mockSubmissions);

      const result = await parentService.getStudentGrades(parentId, studentId);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should throw error if student not linked to parent', async () => {
      const parentId = 'parent1';
      const studentId = 'student1';

      mockPrismaClient.parentLink.findUnique.mockResolvedValue(null);

      await expect(parentService.getStudentGrades(parentId, studentId)).rejects.toThrow(
        'Student not linked to this parent'
      );
    });
  });
});
