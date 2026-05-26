"use client";

import { useMutation, useQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import {
  applyToProject,
  acceptApplication,
  rejectApplication,
  getProjectApplications,
} from "@/front/lib/api/applications";

const APPLICATIONS_ROOT = ["applications"] as const;

export const applicationsQueries = {
  projectApplications: (projectId: string) =>
    queryOptions({
      queryKey: [...APPLICATIONS_ROOT, "project", projectId],
      queryFn: () => getProjectApplications(projectId),
      staleTime: 1000 * 60 * 5, // 5 minutes
    }),
};

export const useProjectApplications = (projectId: string) =>
  useQuery(applicationsQueries.projectApplications(projectId));

export const useApplyToProject = (projectId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => applyToProject(projectId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [...APPLICATIONS_ROOT, "project", projectId],
      });
    },
  });
};

export const useAcceptApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) =>
      acceptApplication(applicationId),
    onSuccess: (data) => {
      // Invalide les candidatures du projet
      queryClient.invalidateQueries({
        queryKey: [...APPLICATIONS_ROOT, "project", data.application.projectId],
      });
    },
  });
};

export const useRejectApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (applicationId: string) =>
      rejectApplication(applicationId),
    onSuccess: (data) => {
      // Invalide les candidatures du projet
      queryClient.invalidateQueries({
        queryKey: [...APPLICATIONS_ROOT, "project", data.application.projectId],
      });
    },
  });
};
