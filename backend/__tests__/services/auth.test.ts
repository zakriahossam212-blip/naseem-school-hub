import { AuthService } from '@/services/auth';
import { ProfileService } from '@/services/auth';
import { mockPrisma, resetMocks } from '../mocks/db.mock';
import { errors } from '@/utils/errors';

jest.mock('@/utils/db', () => ({
  db: mockPrisma,
}));

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    resetMocks();
    authService = new AuthService();
  });

  describe('ensureProfile', () => {
    it('should create a new profile if not exists', async () => {
      const userId = 'user-123';
      const mockProfile = {
        userId,
        fullName: 'John Doe',
        avatarUrl: null,
        role: 'STUDENT',
      };

      mockPrisma.profile.findUnique.mockResolvedValue(null);
      mockPrisma.profile.create.mockResolvedValue(mockProfile);

      const result = await authService.ensureProfile(userId, {
        fullName: 'John Doe',
        role: 'STUDENT',
      });

      expect(mockPrisma.profile.create).toHaveBeenCalled();
      expect(result.userId).toBe(userId);
      expect(result.fullName).toBe('John Doe');
    });

    it('should return existing profile if exists', async () => {
      const userId = 'user-123';
      const mockProfile = {
        userId,
        fullName: 'John Doe',
        avatarUrl: null,
        role: 'STUDENT',
      };

      mockPrisma.profile.findUnique.mockResolvedValue(mockProfile);

      const result = await authService.ensureProfile(userId, {});

      expect(mockPrisma.profile.create).not.toHaveBeenCalled();
      expect(result.userId).toBe(userId);
    });

    it('should update existing profile if fullName provided', async () => {
      const userId = 'user-123';
      const oldProfile = {
        userId,
        fullName: 'Old Name',
        avatarUrl: null,
        role: 'STUDENT',
      };
      const updatedProfile = {
        ...oldProfile,
        fullName: 'New Name',
      };

      mockPrisma.profile.findUnique.mockResolvedValue(oldProfile);
      mockPrisma.profile.update.mockResolvedValue(updatedProfile);

      const result = await authService.ensureProfile(userId, {
        fullName: 'New Name',
      });

      expect(mockPrisma.profile.update).toHaveBeenCalled();
      expect(result.fullName).toBe('New Name');
    });
  });

  describe('addRole', () => {
    it('should add role to user', async () => {
      const userId = 'user-123';
      const mockProfile = {
        userId,
        fullName: 'John Doe',
        avatarUrl: null,
        role: 'STUDENT',
      };

      mockPrisma.profile.findUnique.mockResolvedValue(mockProfile);
      mockPrisma.profile.update.mockResolvedValue(mockProfile);

      await authService.addRole(userId, 'TEACHER');

      expect(mockPrisma.profile.update).toHaveBeenCalledWith({
        where: { userId },
        data: { role: 'TEACHER' },
      });
    });

    it('should throw error if profile not found', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(null);

      await expect(
        authService.addRole('user-123', 'TEACHER')
      ).rejects.toThrow('User profile not found');
    });
  });
});

describe('ProfileService', () => {
  let profileService: ProfileService;

  beforeEach(() => {
    resetMocks();
    profileService = new ProfileService();
  });

  describe('getProfile', () => {
    it('should get user profile', async () => {
      const userId = 'user-123';
      const mockProfile = {
        userId,
        fullName: 'John Doe',
        avatarUrl: null,
        role: 'STUDENT',
      };

      mockPrisma.profile.findUnique.mockResolvedValue(mockProfile);

      const result = await profileService.getProfile(userId);

      expect(result.userId).toBe(userId);
      expect(result.fullName).toBe('John Doe');
    });

    it('should throw error if profile not found', async () => {
      mockPrisma.profile.findUnique.mockResolvedValue(null);

      await expect(
        profileService.getProfile('user-123')
      ).rejects.toThrow('User profile not found');
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const userId = 'user-123';
      const updatedProfile = {
        userId,
        fullName: 'Updated Name',
        avatarUrl: 'https://example.com/avatar.jpg',
        role: 'STUDENT',
      };

      mockPrisma.profile.update.mockResolvedValue(updatedProfile);

      const result = await profileService.updateProfile(userId, {
        fullName: 'Updated Name',
        avatarUrl: 'https://example.com/avatar.jpg',
      });

      expect(result.fullName).toBe('Updated Name');
    });
  });

  describe('listProfiles', () => {
    it('should list profiles by userIds', async () => {
      const userIds = ['user-1', 'user-2'];
      const mockProfiles = [
        { userId: 'user-1', fullName: 'User One', avatarUrl: null },
        { userId: 'user-2', fullName: 'User Two', avatarUrl: null },
      ];

      mockPrisma.profile.findMany.mockResolvedValue(mockProfiles);

      const result = await profileService.listProfiles(userIds);

      expect(result).toHaveLength(2);
      expect(mockPrisma.profile.findMany).toHaveBeenCalledWith({
        where: { userId: { in: userIds } },
      });
    });
  });
});
