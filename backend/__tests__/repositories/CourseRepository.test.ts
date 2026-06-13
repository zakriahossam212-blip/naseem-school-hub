import { CourseRepository } from '@/repositories/courses';
import { mockPrismaClient } from '../mocks/db.mock';

describe('CourseRepository', () => {
  let courseRepository: CourseRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    courseRepository = new CourseRepository(mockPrismaClient);
  });

  describe('create', () => {
    it('should create a course successfully', async () => {
      const courseData = {
        title: 'TypeScript Basics',
        description: 'Learn TypeScript from scratch',
        instructorId: 'instructor1',
        code: 'TS101',
      };

      const mockCourse = {
        id: 'course1',
        ...courseData,
        credits: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.course.create.mockResolvedValue(mockCourse);

      const result = await courseRepository.create(courseData);

      expect(result.id).toBe('course1');
      expect(result.title).toBe('TypeScript Basics');
      expect(mockPrismaClient.course.create).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find course by ID with enrollments', async () => {
      const courseId = 'course1';
      const mockCourse = {
        id: courseId,
        title: 'TypeScript Basics',
        description: 'Learn TypeScript',
        instructorId: 'instructor1',
        code: 'TS101',
        credits: 3,
        instructor: { id: 'instructor1', name: 'John' },
        enrollments: [
          { studentId: 'student1' },
          { studentId: 'student2' },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.course.findUnique.mockResolvedValue(mockCourse);

      const result = await courseRepository.findById(courseId);

      expect(result?.id).toBe(courseId);
      expect(result?.enrollmentCount).toBe(2);
    });

    it('should return null if course not found', async () => {
      mockPrismaClient.course.findUnique.mockResolvedValue(null);

      const result = await courseRepository.findById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findByCode', () => {
    it('should find course by code', async () => {
      const code = 'TS101';
      const mockCourse = {
        id: 'course1',
        title: 'TypeScript Basics',
        code,
        instructorId: 'instructor1',
        description: 'Learn TypeScript',
        credits: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.course.findUnique.mockResolvedValue(mockCourse);

      const result = await courseRepository.findByCode(code);

      expect(result?.code).toBe(code);
    });

    it('should reject empty code', async () => {
      await expect(courseRepository.findByCode('')).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should find all courses', async () => {
      const mockCourses = [
        {
          id: 'course1',
          title: 'TypeScript Basics',
          code: 'TS101',
          instructorId: 'instructor1',
          description: 'Learn TypeScript',
          credits: 3,
          instructor: { id: 'instructor1' },
          enrollments: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaClient.course.findMany.mockResolvedValue(mockCourses);

      const result = await courseRepository.findAll();

      expect(result.length).toBe(1);
      expect(mockPrismaClient.course.findMany).toHaveBeenCalled();
    });

    it('should find courses by instructor', async () => {
      const instructorId = 'instructor1';
      mockPrismaClient.course.findMany.mockResolvedValue([]);

      await courseRepository.findAll(instructorId);

      expect(mockPrismaClient.course.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { instructorId },
        })
      );
    });
  });

  describe('update', () => {
    it('should update a course', async () => {
      const courseId = 'course1';
      const updateData = {
        title: 'Advanced TypeScript',
      };

      const mockUpdated = {
        id: courseId,
        ...updateData,
        description: 'Learn TypeScript',
        instructorId: 'instructor1',
        code: 'TS101',
        credits: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.course.update.mockResolvedValue(mockUpdated);

      const result = await courseRepository.update(courseId, updateData);

      expect(result.title).toBe('Advanced TypeScript');
    });
  });

  describe('getEnrollmentCount', () => {
    it('should count enrollments for a course', async () => {
      mockPrismaClient.enrollment.count.mockResolvedValue(10);

      const result = await courseRepository.getEnrollmentCount('course1');

      expect(result).toBe(10);
    });
  });
});
