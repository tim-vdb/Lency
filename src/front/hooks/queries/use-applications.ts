"use client";

import { useMutation, useQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import {
  applyToProject,
  acceptApplication,
  rejectApplication,
  getProjectApplications,
  type ApplicationData,
} from "@/front/lib/api/applications";

const APPLICATIONS_ROOT = ["applications"] as const;

export const applicationsQueries = {
  projectApplications: (projectId: string) =>
    queryOptions({
      queryKey: [...APPLICATIONS_ROOT, "project", projectId],
      queryFn: () => getProjectApplications(projectId),
      staleTime: 1000 * 60 * 2,
    }),
};

export const useProjectApplications = (projectId: string) =>
  useQuery(applicationsQueries.projectApplications(projectId));

export const useApplyToProject = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data?: ApplicationData) => applyToProject(projectId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [...APPLICATIONS_ROOT, "project", projectId] });
    },
  });
};

export const useAcceptApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, ownerNote }: { applicationId: string; ownerNote?: string }) =>
      acceptApplication(applicationId, ownerNote),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [...APPLICATIONS_ROOT, "project", data.application.projectId],
      });
    },
  });
};

export const useRejectApplication = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, ownerNote }: { applicationId: string; ownerNote?: string }) =>
      rejectApplication(applicationId, ownerNote),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [...APPLICATIONS_ROOT, "project", data.application.projectId],
      });
    },
  });
};
