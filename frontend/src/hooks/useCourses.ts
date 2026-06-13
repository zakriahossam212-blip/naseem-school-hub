import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { coursesApi, CourseDto } from "@/services/api";
import { useAuth } from "@clerk/react";

/**
 * Get all courses or filter by teacher
 */
export function useCourses(teacherId?: string) {
  return useQuery({
    queryKey: ["courses", teacherId],
    queryFn: () => coursesApi.list(teacherId),
  });
}

/**
 * Get single course by ID
 */
export function useCourse(courseId: string | null) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => coursesApi.get(courseId!),
    enabled: !!courseId,
  });
}

/**
 * Create new course
 */
export function useCreateCourse() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: { title: string; description?: string }) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return coursesApi.create(data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

/**
 * Update course
 */
export function useUpdateCourse(courseId: string) {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: { title?: string; description?: string }) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return coursesApi.update(courseId, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
      queryClient.invalidateQueries({ queryKey: ["course", courseId] });
    },
  });
}

/**
 * Delete course
 */
export function useDeleteCourse() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return coursesApi.delete(courseId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}

/**
 * Enroll in course
 */
export function useEnrollCourse() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (courseId: string) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return coursesApi.enroll(courseId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["courses"] });
    },
  });
}
