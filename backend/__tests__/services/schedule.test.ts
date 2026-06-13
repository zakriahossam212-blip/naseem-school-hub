import { ScheduleService } from '@/services/schedule';
import { mockPrismaClient } from '../mocks/db.mock';

describe('ScheduleService', () => {
  let scheduleService: ScheduleService;

  beforeEach(() => {
    jest.clearAllMocks();
    scheduleService = new ScheduleService(mockPrismaClient);
  });

  describe('createScheduleEntry', () => {
    it('should create a schedule entry successfully', async () => {
      const scheduleData = {
        courseId: 'course1',
        eventName: 'Class Lecture',
        eventType: 'LECTURE',
        startTime: '09:00',
        endTime: '10:30',
        dayOfWeek: 1,
        description: 'Introduction to TypeScript',
      };

      const mockSchedule = {
        id: 'schedule1',
        ...scheduleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.scheduleEntry.create.mockResolvedValue(mockSchedule);

      const result = await scheduleService.createScheduleEntry(scheduleData);

      expect(result).toEqual(mockSchedule);
      expect(mockPrismaClient.scheduleEntry.create).toHaveBeenCalledWith({
        data: scheduleData,
      });
    });

    it('should validate time format before creating', async () => {
      const invalidData = {
        courseId: 'course1',
        eventName: 'Class Lecture',
        eventType: 'LECTURE',
        startTime: '25:00', // Invalid hour
        endTime: '10:30',
        dayOfWeek: 1,
      };

      await expect(scheduleService.createScheduleEntry(invalidData)).rejects.toThrow();
    });
  });

  describe('getScheduleEntry', () => {
    it('should retrieve a schedule entry by ID', async () => {
      const scheduleId = 'schedule1';
      const mockSchedule = {
        id: scheduleId,
        courseId: 'course1',
        eventName: 'Class Lecture',
        eventType: 'LECTURE',
        startTime: '09:00',
        endTime: '10:30',
        dayOfWeek: 1,
        description: 'Introduction to TypeScript',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.scheduleEntry.findUnique.mockResolvedValue(mockSchedule);

      const result = await scheduleService.getScheduleEntry(scheduleId);

      expect(result).toEqual(mockSchedule);
      expect(mockPrismaClient.scheduleEntry.findUnique).toHaveBeenCalledWith({
        where: { id: scheduleId },
      });
    });

    it('should throw error if schedule entry not found', async () => {
      const scheduleId = 'nonexistent';
      mockPrismaClient.scheduleEntry.findUnique.mockResolvedValue(null);

      await expect(scheduleService.getScheduleEntry(scheduleId)).rejects.toThrow(
        'Schedule entry not found'
      );
    });
  });

  describe('listScheduleEntries', () => {
    it('should list all schedule entries', async () => {
      const mockSchedules = [
        {
          id: 'schedule1',
          courseId: 'course1',
          eventName: 'Lecture 1',
          eventType: 'LECTURE',
          startTime: '09:00',
          endTime: '10:30',
          dayOfWeek: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'schedule2',
          courseId: 'course1',
          eventName: 'Lab Session',
          eventType: 'LAB',
          startTime: '14:00',
          endTime: '16:00',
          dayOfWeek: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaClient.scheduleEntry.findMany.mockResolvedValue(mockSchedules);

      const result = await scheduleService.listScheduleEntries();

      expect(result).toHaveLength(2);
      expect(mockPrismaClient.scheduleEntry.findMany).toHaveBeenCalledWith({
        orderBy: { dayOfWeek: 'asc' },
      });
    });

    it('should list schedule entries filtered by courseId', async () => {
      const courseId = 'course1';
      const mockSchedules = [
        {
          id: 'schedule1',
          courseId,
          eventName: 'Lecture',
          eventType: 'LECTURE',
          startTime: '09:00',
          endTime: '10:30',
          dayOfWeek: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaClient.scheduleEntry.findMany.mockResolvedValue(mockSchedules);

      const result = await scheduleService.listScheduleEntries(courseId);

      expect(result).toHaveLength(1);
      expect(mockPrismaClient.scheduleEntry.findMany).toHaveBeenCalledWith({
        where: { courseId },
        orderBy: { dayOfWeek: 'asc' },
      });
    });
  });

  describe('updateScheduleEntry', () => {
    it('should update a schedule entry', async () => {
      const scheduleId = 'schedule1';
      const updateData = {
        eventName: 'Updated Lecture',
        startTime: '10:00',
      };

      const mockUpdated = {
        id: scheduleId,
        courseId: 'course1',
        ...updateData,
        endTime: '11:30',
        eventType: 'LECTURE',
        dayOfWeek: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.scheduleEntry.update.mockResolvedValue(mockUpdated);

      const result = await scheduleService.updateScheduleEntry(scheduleId, updateData);

      expect(result).toEqual(mockUpdated);
      expect(mockPrismaClient.scheduleEntry.update).toHaveBeenCalledWith({
        where: { id: scheduleId },
        data: updateData,
      });
    });
  });
});
