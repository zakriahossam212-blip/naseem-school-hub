import { useQuery } from "@tanstack/react-query";
import { enrollmentsApi } from "@/services/api";
import { useAuth } from "@clerk/react";

/**
 * Get list of course IDs that current user is enrolled in
 */
export function useEnrollments() {
  const { getToken, isSignedIn } = useAuth();

  return useQuery({
    queryKey: ["enrollments"],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return enrollmentsApi.list(token);
    },
    enabled: isSignedIn,
  });
}
