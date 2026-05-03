import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    createResourceComment,
    fetchResourceById,
    fetchResourceComments,
    fetchResources,
    toggleSaveResource,
    toggleVoteResource,
    voteResourceComment,
    type CreateResourceCommentInput,
    type VoteResourceCommentInput,
} from "@/front/lib/api/resources";
import { CommentWithChildren } from "@/front/types/post.schema";
import { ResourceWithUserState } from "@/front/types/resource.schema";

function applyVoteInTree(
    comments: CommentWithChildren[],
    commentId: string,
    prev: VoteResourceCommentInput["prev"],
    next: VoteResourceCommentInput["next"],
): CommentWithChildren[] {
    return comments.map((c) => {
        if (c.id === commentId) {
            return {
                ...c,
                upvoteCount:
                    c.upvoteCount + (next === "upvote" ? 1 : 0) - (prev === "upvote" ? 1 : 0),
                downvoteCount:
                    c.downvoteCount + (next === "downvote" ? 1 : 0) - (prev === "downvote" ? 1 : 0),
            };
        }
        return { ...c, children: applyVoteInTree(c.children, commentId, prev, next) };
    });
}

const RESOURCE_ROOT = ["resources"] as const;

export const resourceQueries = {
    all: RESOURCE_ROOT,

    lists: (categoryId?: string) =>
        queryOptions({
            queryKey: [...RESOURCE_ROOT, "list", categoryId ?? "all"] as const,
            queryFn: () => fetchResources(categoryId),
            staleTime: 1000 * 60 * 5,
        }),

    detail: (id: string) =>
        queryOptions({
            queryKey: [...RESOURCE_ROOT, "detail", id] as const,
            queryFn: () => fetchResourceById(id),
            staleTime: 1000 * 60 * 5,
            enabled: !!id,
        }),

    comments: (resourceId: string) =>
        queryOptions({
            queryKey: [...RESOURCE_ROOT, "comments", resourceId] as const,
            queryFn: () => fetchResourceComments(resourceId),
            staleTime: 1000 * 60 * 2,
            enabled: !!resourceId,
        }),
};

export const useResources = (categoryId?: string) => useQuery(resourceQueries.lists(categoryId));

export const useResourceById = (id: string) => useQuery(resourceQueries.detail(id));

export const useResourceComments = (resourceId: string) =>
    useQuery(resourceQueries.comments(resourceId));

export const useToggleSaveResource = (resourceId: string, categoryId?: string) => {
    const queryClient = useQueryClient();
    const listKey = resourceQueries.lists(categoryId).queryKey;
    const detailKey = resourceQueries.detail(resourceId).queryKey;

    return useMutation({
        mutationFn: () => toggleSaveResource(resourceId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: listKey });
            await queryClient.cancelQueries({ queryKey: detailKey });
            const previousList = queryClient.getQueryData<ResourceWithUserState[]>(listKey);
            const previousDetail = queryClient.getQueryData<ResourceWithUserState>(detailKey);

            queryClient.setQueryData<ResourceWithUserState[]>(listKey, (old = []) =>
                old.map((r) =>
                    r.id === resourceId
                        ? {
                              ...r,
                              isSaved: !r.isSaved,
                              saveCount: r.isSaved ? r.saveCount - 1 : r.saveCount + 1,
                          }
                        : r
                )
            );
            queryClient.setQueryData<ResourceWithUserState>(detailKey, (old) =>
                old
                    ? {
                          ...old,
                          isSaved: !old.isSaved,
                          saveCount: old.isSaved ? old.saveCount - 1 : old.saveCount + 1,
                      }
                    : old
            );
            return { previousList, previousDetail };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousList) queryClient.setQueryData(listKey, context.previousList);
            if (context?.previousDetail) queryClient.setQueryData(detailKey, context.previousDetail);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: listKey });
            queryClient.invalidateQueries({ queryKey: detailKey });
        },
    });
};

export const useToggleVoteResource = (resourceId: string, categoryId?: string) => {
    const queryClient = useQueryClient();
    const listKey = resourceQueries.lists(categoryId).queryKey;
    const detailKey = resourceQueries.detail(resourceId).queryKey;

    return useMutation({
        mutationFn: () => toggleVoteResource(resourceId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: listKey });
            await queryClient.cancelQueries({ queryKey: detailKey });
            const previousList = queryClient.getQueryData<ResourceWithUserState[]>(listKey);
            const previousDetail = queryClient.getQueryData<ResourceWithUserState>(detailKey);

            queryClient.setQueryData<ResourceWithUserState[]>(listKey, (old = []) =>
                old.map((r) =>
                    r.id === resourceId
                        ? {
                              ...r,
                              isVoted: !r.isVoted,
                              upvoteCount: r.isVoted ? r.upvoteCount - 1 : r.upvoteCount + 1,
                          }
                        : r
                )
            );
            queryClient.setQueryData<ResourceWithUserState>(detailKey, (old) =>
                old
                    ? {
                          ...old,
                          isVoted: !old.isVoted,
                          upvoteCount: old.isVoted ? old.upvoteCount - 1 : old.upvoteCount + 1,
                      }
                    : old
            );
            return { previousList, previousDetail };
        },
        onError: (_err, _vars, context) => {
            if (context?.previousList) queryClient.setQueryData(listKey, context.previousList);
            if (context?.previousDetail) queryClient.setQueryData(detailKey, context.previousDetail);
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: listKey });
            queryClient.invalidateQueries({ queryKey: detailKey });
        },
    });
};

export const useVoteResourceComment = (resourceId: string) => {
    const queryClient = useQueryClient();
    const commentsKey = resourceQueries.comments(resourceId).queryKey;

    return useMutation({
        mutationFn: (input: VoteResourceCommentInput) => voteResourceComment(input),
        onMutate: async ({ commentId, prev, next }) => {
            await queryClient.cancelQueries({ queryKey: commentsKey });
            const previous = queryClient.getQueryData<CommentWithChildren[]>(commentsKey);
            queryClient.setQueryData<CommentWithChildren[]>(commentsKey, (old = []) =>
                applyVoteInTree(old, commentId, prev, next)
            );
            return { previous };
        },
        onError: (_err, _input, context) => {
            if (context?.previous) {
                queryClient.setQueryData(commentsKey, context.previous);
            }
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: commentsKey }),
    });
};

export const useCreateResourceComment = (resourceId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: CreateResourceCommentInput) => createResourceComment(input),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...RESOURCE_ROOT, "comments", resourceId] });
            queryClient.invalidateQueries({ queryKey: [...RESOURCE_ROOT, "detail", resourceId] });
        },
    });
};
