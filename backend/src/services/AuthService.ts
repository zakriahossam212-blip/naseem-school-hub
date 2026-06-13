import { db } from "@/utils/db";
import { errors } from "@/utils/errors";
import { ProfileDto, EnsureProfileRequest } from "@/types/index";
import { Role } from "@prisma/client";

export class AuthService {
  /**
   * Get user profile by userId
   */
  async getProfile(userId: string): Promise<ProfileDto> {
    const profile = await db.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw errors.notFound("User profile not found");
    }

    return {
      userId: profile.userId,
      fullName: profile.fullName,
      avatarUrl: profile.avatarUrl,
    };
  }

  /**
   * Ensure user has a profile - create if doesn't exist
   * Used on first login or profile setup
   */
  async ensureProfile(
    userId: string,
    data: EnsureProfileRequest
  ): Promise<ProfileDto & { roles: string[] }> {
    // Try to get existing profile
    let profile = await db.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      // Create new profile
      const roleStr = (data.role || "STUDENT").toUpperCase() as Role;
      profile = await db.profile.create({
        data: {
          userId,
          fullName: data.fullName || null,
          role: roleStr as Role,
        },
      });
    } else if (data.fullName) {
      // Update existing profile
      profile = await db.profile.update({
        where: { userId },
        data: { fullName: data.fullName },
      });
    }

    // Return profile with roles array
    return {
      userId: profile.userId,
      fullName: profile.fullName,
      avatarUrl: profile.avatarUrl,
      roles: profile.role ? [profile.role] : [],
    };
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: { fullName?: string; avatarUrl?: string }
  ): Promise<ProfileDto> {
    const profile = await db.profile.update({
      where: { userId },
      data,
    });

    return {
      userId: profile.userId,
      fullName: profile.fullName,
      avatarUrl: profile.avatarUrl,
    };
  }

  /**
   * Add role to user
   */
  async addRole(userId: string, role: Role): Promise<void> {
    const profile = await db.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw errors.notFound("User profile not found");
    }

    // For now, each user has one role. In a more complex system,
    // we'd use a many-to-many relationship
    await db.profile.update({
      where: { userId },
      data: { role },
    });
  }

  /**
   * List all profiles by user IDs
   */
  async listProfiles(userIds: string[]): Promise<ProfileDto[]> {
    const profiles = await db.profile.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
    });

    return profiles.map((p) => ({
      userId: p.userId,
      fullName: p.fullName,
      avatarUrl: p.avatarUrl,
    }));
  }
}

export const authService = new AuthService();
