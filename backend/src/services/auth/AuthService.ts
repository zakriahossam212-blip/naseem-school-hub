import { db } from "@/utils/db";
import { errors } from "@/utils/errors";
import { EnsureProfileRequest, ProfileDto } from "@/types/index";
import { Role } from "@prisma/client";

export class AuthService {
  /**
   * Ensure user has a profile - create if doesn't exist
   * Used on first login or profile setup
   */
  async ensureProfile(
    userId: string,
    data: EnsureProfileRequest
  ): Promise<ProfileDto & { roles: string[] }> {
    let profile = await db.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      const roleStr = (data.role || "STUDENT").toUpperCase() as Role;
      profile = await db.profile.create({
        data: {
          userId,
          fullName: data.fullName || null,
          role: roleStr as Role,
        },
      });
    } else if (data.fullName) {
      profile = await db.profile.update({
        where: { userId },
        data: { fullName: data.fullName },
      });
    }

    return {
      userId: profile.userId,
      fullName: profile.fullName,
      avatarUrl: profile.avatarUrl,
      roles: profile.role ? [profile.role] : [],
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

    await db.profile.update({
      where: { userId },
      data: { role },
    });
  }
}

export const authService = new AuthService();
