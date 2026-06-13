import { PrismaClient, Profile } from '@prisma/client';
import { BaseRepository } from '../BaseRepository';
import { ProfileDto } from '@/types';

/**
 * ProfileRepository handles all profile-related database operations
 */
export class ProfileRepository extends BaseRepository {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Create a new profile
   */
  async create(data: {
    userId: string;
    name: string;
    email: string;
    role: string;
    phoneNumber?: string;
    avatar?: string;
  }): Promise<ProfileDto> {
    try {
      const profile = await this.prisma.profile.create({
        data,
      });
      return this.mapToDto(profile);
    } catch (error) {
      this.handleError(error, 'Failed to create profile');
    }
  }

  /**
   * Get profile by ID
   */
  async findById(id: string): Promise<ProfileDto | null> {
    this.validateId(id, 'Profile ID');
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { id },
      });
      return profile ? this.mapToDto(profile) : null;
    } catch (error) {
      this.handleError(error, 'Failed to fetch profile');
    }
  }

  /**
   * Get profile by userId
   */
  async findByUserId(userId: string): Promise<ProfileDto | null> {
    this.validateId(userId, 'User ID');
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { userId },
      });
      return profile ? this.mapToDto(profile) : null;
    } catch (error) {
      this.handleError(error, 'Failed to fetch profile by userId');
    }
  }

  /**
   * Get profile by email
   */
  async findByEmail(email: string): Promise<ProfileDto | null> {
    if (!email || !email.includes('@')) {
      throw new Error('Valid email is required');
    }
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { email },
      });
      return profile ? this.mapToDto(profile) : null;
    } catch (error) {
      this.handleError(error, 'Failed to fetch profile by email');
    }
  }

  /**
   * Get all profiles with optional filtering
   */
  async findAll(where?: Record<string, any>): Promise<ProfileDto[]> {
    try {
      const profiles = await this.prisma.profile.findMany({
        where,
        orderBy: { createdAt: 'desc' },
      });
      return profiles.map(p => this.mapToDto(p));
    } catch (error) {
      this.handleError(error, 'Failed to fetch profiles');
    }
  }

  /**
   * Update profile
   */
  async update(
    id: string,
    data: Partial<{
      name: string;
      email: string;
      phoneNumber: string;
      avatar: string;
    }>
  ): Promise<ProfileDto> {
    this.validateId(id, 'Profile ID');
    try {
      const profile = await this.prisma.profile.update({
        where: { id },
        data,
      });
      return this.mapToDto(profile);
    } catch (error) {
      this.handleError(error, 'Failed to update profile');
    }
  }

  /**
   * Delete profile
   */
  async delete(id: string): Promise<void> {
    this.validateId(id, 'Profile ID');
    try {
      await this.prisma.profile.delete({
        where: { id },
      });
    } catch (error) {
      this.handleError(error, 'Failed to delete profile');
    }
  }

  /**
   * Check if profile exists
   */
  async exists(id: string): Promise<boolean> {
    this.validateId(id, 'Profile ID');
    try {
      const profile = await this.prisma.profile.findUnique({
        where: { id },
      });
      return !!profile;
    } catch {
      return false;
    }
  }

  /**
   * Count profiles by role
   */
  async countByRole(role: string): Promise<number> {
    try {
      return await this.prisma.profile.count({
        where: { role },
      });
    } catch (error) {
      this.handleError(error, 'Failed to count profiles');
    }
  }

  /**
   * Map database Profile to ProfileDto
   */
  private mapToDto(profile: Profile): ProfileDto {
    return {
      id: profile.id,
      userId: profile.userId,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      phoneNumber: profile.phoneNumber || undefined,
      avatar: profile.avatar || undefined,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
    };
  }
}
