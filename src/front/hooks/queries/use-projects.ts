import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createProjectComment,
    fetchProjectById,
    fetchProjectComments,
    fetchProjects,
    type CreateProjectCommentInput,
} from "@/front/lib/api/projects";
import { CommentWithChildren } from "@/front/types/post.schema";

const PROJECT_ROOT = ["projects"] as const;

export const projectQueries = {
    all: PROJECT_ROOT,

    lists: () =>
        queryOptions({
            queryKey: [...PROJECT_ROOT, "list"] as const,
            queryFn: fetchProjects,
            staleTime: 1000 * 60 * 5,
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

export const useProjectById = (id: string) => useQuery(projectQueries.detail(id));

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
