import { useQuery } from "@tanstack/react-query";
import { profilesApi, ProfileDto } from "@/services/api";

/**
 * Get user profile by ID
 */
export function useProfile(userId: string | null) {
  return useQuery({
    queryKey: ["profile", userId],
    queryFn: () => profilesApi.get(userId!),
    enabled: !!userId,
  });
}

/**
 * Get multiple user profiles
 */
export function useProfiles(userIds: string[]) {
  return useQuery({
    queryKey: ["profiles", userIds],
    queryFn: () => profilesApi.listByIds(userIds),
    enabled: userIds.length > 0,
  });
}
