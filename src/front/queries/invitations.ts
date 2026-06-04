"use client";

import { useMutation, useQuery, useQueryClient, queryOptions } from "@tanstack/react-query";
import {
    getProjectInvitations,
    sendInvitation,
    respondToInvitation,
    searchReadyUsers,
} from "@/front/lib/api/invitations";

const INVITATIONS_ROOT = ["invitations"] as const;

export const invitationsQueries = {
    projectInvitations: (projectId: string) =>
        queryOptions({
            queryKey: [...INVITATIONS_ROOT, "project", projectId],
            queryFn: () => getProjectInvitations(projectId),
            staleTime: 1000 * 60 * 2,
        }),
    readyUsers: (q: string) =>
        queryOptions({
            queryKey: [...INVITATIONS_ROOT, "ready-users", q],
            queryFn: () => searchReadyUsers(q),
            staleTime: 1000 * 60 * 1,
        }),
};

export const useProjectInvitations = (projectId: string) =>
    useQuery(invitationsQueries.projectInvitations(projectId));

export const useReadyUsers = (q: string) =>
    useQuery(invitationsQueries.readyUsers(q));

export const useSendInvitation = (projectId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (userId: string) => sendInvitation(projectId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...INVITATIONS_ROOT, "project", projectId] });
        },
    });
};

export const useRespondToInvitation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ invitationId, action }: { invitationId: string; action: "accept" | "reject" }) =>
            respondToInvitation(invitationId, action),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: INVITATIONS_ROOT });
        },
    });
};
