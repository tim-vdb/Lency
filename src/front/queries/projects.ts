import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createProject,
    createProjectComment,
    deleteProject,
    fetchMyDraftProjects,
    fetchProjectById,
    fetchProjectComments,
    fetchProjects,
    fetchMyProjects,
    reportProject,
    updateProject,
    type CreateProjectCommentInput,
    type CreateProjectInput,
    type UpdateProjectInput,
} from "@/front/lib/api/projects";
import { CommentWithChildren } from "@/front/schemas/types/post.type";
import { ProjectWithOwner } from "@/front/schemas/types/project.type";
import { SEARCH_ROOT } from "@/front/lib/api/search";

const PROJECT_ROOT = ["projects"] as const;

export const projectQueries = {
    all: PROJECT_ROOT,

    lists: () =>
        queryOptions({
            queryKey: [...PROJECT_ROOT, "list"] as const,
            queryFn: fetchProjects,
            staleTime: 1000 * 60 * 5,
        }),

    mine: () =>
        queryOptions({
            queryKey: [...PROJECT_ROOT, "mine"] as const,
            queryFn: fetchMyProjects,
            staleTime: 1000 * 60 * 2,
        }),

    detail: (id: string) =>
        queryOptions({
            queryKey: [...PROJECT_ROOT, "detail", id] as const,
            queryFn: () => fetchProjectById(id),
            staleTime: 1000 * 60 * 5,
            enabled: !!id,
        }),

    comments: (projectId: string) =>
        queryOptions({
            queryKey: [...PROJECT_ROOT, "comments", projectId] as const,
            queryFn: () => fetchProjectComments(projectId),
            staleTime: 1000 * 60 * 2,
            enabled: !!projectId,
        }),
};

export const useProjects = () => useQuery(projectQueries.lists());
export const useMyProjects = () => useQuery(projectQueries.mine());

export const useMyDraftProjects = () =>
    useQuery({
        queryKey: [...PROJECT_ROOT, "drafts"] as const,
        queryFn: fetchMyDraftProjects,
        staleTime: 0,
    });

export const useProjectById = (id: string) => useQuery(projectQueries.detail(id));

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateProjectInput) => createProject(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECT_ROOT });
            queryClient.invalidateQueries({ queryKey: SEARCH_ROOT });
        },
    });
};

export const useProjectComments = (projectId: string) =>
    useQuery(projectQueries.comments(projectId));

export const useCreateProjectComment = (projectId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateProjectCommentInput) => createProjectComment(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...PROJECT_ROOT, "comments", projectId] });
            queryClient.invalidateQueries({ queryKey: [...PROJECT_ROOT, "detail", projectId] });
        },
    });
};

export const useUpdateProject = (projectId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: UpdateProjectInput) => updateProject(projectId, input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: PROJECT_ROOT });
            queryClient.invalidateQueries({ queryKey: SEARCH_ROOT });
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteProject(id),
        onMutate: async (projectId: string) => {
            const listKey = projectQueries.lists().queryKey;
            await queryClient.cancelQueries({ queryKey: listKey });
            const previous = queryClient.getQueryData<ProjectWithOwner[]>(listKey);
            queryClient.setQueryData<ProjectWithOwner[]>(listKey, (old = []) =>
                old.filter((p) => p.id !== projectId)
            );
            return { previous };
        },
        onError: (_err, _id, context) => {
            if (context?.previous) queryClient.setQueryData(projectQueries.lists().queryKey, context.previous);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: PROJECT_ROOT });
            queryClient.invalidateQueries({ queryKey: SEARCH_ROOT });
        },
    });
};

export const useReportProject = (projectId: string) => {
    return useMutation({
        mutationFn: (reason?: string) => reportProject(projectId, reason),
    });
};

export const useVoteProjectComment = (projectId: string) => {
    const queryClient = useQueryClient();
    const commentsKey = projectQueries.comments(projectId).queryKey;

    return useMutation({
        mutationFn: async ({ commentId, prev, next }: { commentId: string; prev: "upvote" | "downvote" | null; next: "upvote" | "downvote" | null }) => {
            const res = await fetch(`/api/projects/${projectId}/comments/${commentId}/vote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prev, next }),
            });
            if (!res.ok) throw new Error("Erreur lors du vote");
        },
        onMutate: async ({ commentId, prev, next }) => {
            await queryClient.cancelQueries({ queryKey: commentsKey });
            const previous = queryClient.getQueryData<CommentWithChildren[]>(commentsKey);
            queryClient.setQueryData<CommentWithChildren[]>(commentsKey, (old = []) =>
                applyVoteInTree(old, commentId, prev, next)
            );
            return { previous };
        },
        onError: (_err, _input, context) => {
            if (context?.previous) queryClient.setQueryData(commentsKey, context.previous);
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: commentsKey }),
    });
};

function applyVoteInTree(
    comments: CommentWithChildren[],
    commentId: string,
    prev: "upvote" | "downvote" | null,
    next: "upvote" | "downvote" | null,
): CommentWithChildren[] {
    return comments.map((c) => {
        if (c.id === commentId) {
            return {
                ...c,
                upvoteCount: c.upvoteCount + (next === "upvote" ? 1 : 0) - (prev === "upvote" ? 1 : 0),
                downvoteCount: c.downvoteCount + (next === "downvote" ? 1 : 0) - (prev === "downvote" ? 1 : 0),
            };
        }
        return { ...c, children: applyVoteInTree(c.children, commentId, prev, next) };
    });
}
