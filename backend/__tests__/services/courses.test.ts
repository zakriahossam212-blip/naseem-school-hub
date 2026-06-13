import { CourseService } from '@/services/courses';
import { EnrollmentService } from '@/services/courses';
import { mockPrisma, resetMocks } from '../mocks/db.mock';
import { errors } from '@/utils/errors';

jest.mock('@/utils/db', () => ({
  db: mockPrisma,
}));

describe('CourseService', () => {
  let courseService: CourseService;

  beforeEach(() => {
    resetMocks();
    courseService = new CourseService();
  });

  describe('createCourse', () => {
    it('should create a new course', async () => {
      const teacherId = 'teacher-123';
      const mockCourse = {
        id: 'course-123',
        title: 'Math 101',
        description: 'Introduction to Calculus',
        teacherId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.profile.findUnique.mockResolvedValue({ userId: teacherId });
      mockPrisma.course.create.mockResolvedValue(mockCourse);

      const result = await courseService.createCourse(teacherId, {
        title: 'Math 101',
        description: 'Introduction to Calculus',
      });

      expect(result.title).toBe('Math 101');
      expect(result.teacherId).toBe(teacherId);
    });

    it('should throw error if teacher not found', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(null);

      await expect(
        courseService.createCourse('teacher-123', { title: 'Math 101' })
      ).rejects.toThrow('Teacher profile not found');
    });
  });

  describe('getCourse', () => {
    it('should get course by ID', async () => {
      const mockCourse = {
        id: 'course-123',
        title: 'Math 101',
        description: 'Introduction to Calculus',
        teacherId: 'teacher-123',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrisma.course.findUnique.mockResolvedValue(mockCourse);

      const result = await courseService.getCourse('course-123');

      expect(result.id).toBe('course-123');
      expect(result.title).toBe('Math 101');
    });

    it('should throw error if course not found', async () => {
      mockPrisma.course.findUnique.mockResolvedValue(null);

      await expect(courseService.getCourse('course-123')).rejects.toThrow('Course not found');
    });
  });

  describe('listCourses', () => {
    it('should list all courses', async () => {
      const mockCourses = [
        {
          id: 'course-1',
          title: 'Math 101',
          description: 'Math course',
          teacherId: 'teacher-1',
          createdAt: new Date(),
        },
        {
          id: 'course-2',
          title: 'Science 101',
          description: 'Science course',
          teacherId: 'teacher-2',
          createdAt: new Date(),
        },
      ];

      mockPrisma.course.findMany.mockResolvedValue(mockCourses);

      const result = await courseService.listCourses();

      expect(result).toHaveLength(2);
    });
  });
});

describe('EnrollmentService', () => {
  let enrollmentService: EnrollmentService;

  beforeEach(() => {
    resetMocks();
    enrollmentService = new EnrollmentService();
  });

  describe('enrollStudent', () => {
    it('should enroll student in course', async () => {
      const courseId = 'course-123';
      const studentId = 'student-123';

      mockPrisma.course.findUnique.mockResolvedValue({ id: courseId });
      mockPrisma.enrollment.findUnique.mockResolvedValue(null);
      mockPrisma.enrollment.create.mockResolvedValue({});

      await enrollmentService.enrollStudent(courseId, studentId);

      expect(mockPrisma.enrollment.create).toHaveBeenCalled();
    });

    it('should throw error if course not found', async () => {
      mockPrisma.course.findUnique.mockResolvedValue(null);

      await expect(
        enrollmentService.enrollStudent('course-123', 'student-123')
      ).rejects.toThrow('Course not found');
    });

    it('should throw error if already enrolled', async () => {
      mockPrisma.course.findUnique.mockResolvedValue({ id: 'course-123' });
      mockPrisma.enrollment.findUnique.mockResolvedValue({});

      await expect(
        enrollmentService.enrollStudent('course-123', 'student-123')
      ).rejects.toThrow('Student is already enrolled in this course');
    });
  });

  describe('getStudentEnrollments', () => {
    it('should get student enrollments', async () => {
      const enrollments = [
        { courseId: 'course-1' },
        { courseId: 'course-2' },
      ];

      mockPrisma.enrollment.findMany.mockResolvedValue(enrollments);

      const result = await enrollmentService.getStudentEnrollments('student-123');

      expect(result).toEqual(['course-1', 'course-2']);
    });
  });
});
