import { db } from "@/utils/db";
import { errors } from "@/utils/errors";
import { ProfileDto, UpdateProfileRequest } from "@/types/index";

export class ProfileService {
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
   * Update user profile
   */
  async updateProfile(
    userId: string,
    data: UpdateProfileRequest
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

export const profileService = new ProfileService();
