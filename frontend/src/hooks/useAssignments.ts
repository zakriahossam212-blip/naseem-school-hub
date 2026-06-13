import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { assignmentsApi, submissionsApi, AssignmentDto, SubmissionDto } from "@/services/api";
import { useAuth } from "@clerk/react";

/**
 * Get assignments for a course
 */
export function useAssignments(courseId?: string) {
  return useQuery({
    queryKey: ["assignments", courseId],
    queryFn: () => assignmentsApi.list(courseId),
  });
}

/**
 * Get single assignment
 */
export function useAssignment(assignmentId: string | null) {
  return useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: () => assignmentsApi.get(assignmentId!),
    enabled: !!assignmentId,
  });
}

/**
 * Create assignment (teacher)
 */
export function useCreateAssignment() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      courseId: string;
      title: string;
      description?: string;
      dueDate?: string;
      maxGrade?: number;
    }) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return assignmentsApi.create(data, token);
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["assignments", data.courseId] });
    },
  });
}

/**
 * Delete assignment (teacher)
 */
export function useDeleteAssignment() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (assignmentId: string) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return assignmentsApi.delete(assignmentId, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
    },
  });
}

/**
 * Get submissions for an assignment
 */
export function useSubmissions(assignmentId: string | null) {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ["submissions", assignmentId],
    queryFn: async () => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      if (!assignmentId) throw new Error("assignmentId required");
      return submissionsApi.list(assignmentId, token);
    },
    enabled: !!assignmentId && !!getToken,
  });
}

/**
 * Submit assignment (student)
 */
export function useSubmitAssignment() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      assignmentId: string;
      content?: string;
      fileUrl?: string;
    }) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return submissionsApi.create(data, token);
    },
    onSuccess: (_, data) => {
      queryClient.invalidateQueries({ queryKey: ["submissions", data.assignmentId] });
    },
  });
}

/**
 * Grade submission (teacher)
 */
export function useGradeSubmission() {
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  return useMutation({
    mutationFn: async (data: {
      submissionId: string;
      grade: number;
      feedback?: string;
    }) => {
      const token = await getToken();
      if (!token) throw new Error("Not authenticated");
      return submissionsApi.update(
        data.submissionId,
        { grade: data.grade, feedback: data.feedback },
        token
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submissions"] });
    },
  });
}
