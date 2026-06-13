import { ProfileRepository } from '@/repositories/auth';
import { mockPrismaClient } from '../mocks/db.mock';

describe('ProfileRepository', () => {
  let profileRepository: ProfileRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    profileRepository = new ProfileRepository(mockPrismaClient);
  });

  describe('create', () => {
    it('should create a profile successfully', async () => {
      const profileData = {
        userId: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'STUDENT',
      };

      const mockProfile = {
        id: 'profile1',
        ...profileData,
        phoneNumber: null,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.profile.create.mockResolvedValue(mockProfile);

      const result = await profileRepository.create(profileData);

      expect(result.id).toBe('profile1');
      expect(result.name).toBe('John Doe');
      expect(mockPrismaClient.profile.create).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find profile by ID', async () => {
      const profileId = 'profile1';
      const mockProfile = {
        id: profileId,
        userId: 'user1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'STUDENT',
        phoneNumber: null,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.profile.findUnique.mockResolvedValue(mockProfile);

      const result = await profileRepository.findById(profileId);

      expect(result?.id).toBe(profileId);
      expect(mockPrismaClient.profile.findUnique).toHaveBeenCalledWith({
        where: { id: profileId },
      });
    });

    it('should return null if profile not found', async () => {
      mockPrismaClient.profile.findUnique.mockResolvedValue(null);

      const result = await profileRepository.findById('nonexistent');

      expect(result).toBeNull();
    });

    it('should validate ID before querying', async () => {
      await expect(profileRepository.findById('')).rejects.toThrow();
    });
  });

  describe('findByUserId', () => {
    it('should find profile by userId', async () => {
      const userId = 'user1';
      const mockProfile = {
        id: 'profile1',
        userId,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'STUDENT',
        phoneNumber: null,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.profile.findUnique.mockResolvedValue(mockProfile);

      const result = await profileRepository.findByUserId(userId);

      expect(result?.userId).toBe(userId);
    });
  });

  describe('findByEmail', () => {
    it('should find profile by email', async () => {
      const email = 'john@example.com';
      const mockProfile = {
        id: 'profile1',
        userId: 'user1',
        name: 'John Doe',
        email,
        role: 'STUDENT',
        phoneNumber: null,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.profile.findUnique.mockResolvedValue(mockProfile);

      const result = await profileRepository.findByEmail(email);

      expect(result?.email).toBe(email);
    });

    it('should reject invalid email', async () => {
      await expect(profileRepository.findByEmail('notanemail')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update a profile', async () => {
      const profileId = 'profile1';
      const updateData = {
        name: 'Jane Doe',
      };

      const mockUpdated = {
        id: profileId,
        userId: 'user1',
        ...updateData,
        email: 'john@example.com',
        role: 'STUDENT',
        phoneNumber: null,
        avatar: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaClient.profile.update.mockResolvedValue(mockUpdated);

      const result = await profileRepository.update(profileId, updateData);

      expect(result.name).toBe('Jane Doe');
      expect(mockPrismaClient.profile.update).toHaveBeenCalledWith({
        where: { id: profileId },
        data: updateData,
      });
    });
  });

  describe('delete', () => {
    it('should delete a profile', async () => {
      const profileId = 'profile1';

      mockPrismaClient.profile.delete.mockResolvedValue({});

      await profileRepository.delete(profileId);

      expect(mockPrismaClient.profile.delete).toHaveBeenCalledWith({
        where: { id: profileId },
      });
    });
  });

  describe('countByRole', () => {
    it('should count profiles by role', async () => {
      mockPrismaClient.profile.count.mockResolvedValue(5);

      const result = await profileRepository.countByRole('STUDENT');

      expect(result).toBe(5);
    });
  });
});
