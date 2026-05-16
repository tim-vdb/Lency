import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    createComment,
    createPost,
    deletePost,
    fetchCommentsByPostId,
    fetchFollowedCategoryPosts,
    fetchPostById,
    fetchPosts,
    fetchPostsByAuthor,
    fetchSavedPosts,
    reportPost,
    toggleSavePost,
    toggleVotePost,
    updatePost,
    voteComment,
    type CreateCommentInput,
    type CreatePostInput,
    type VoteCommentInput,
} from "@/front/lib/api/posts"
import { CommentWithChildren, PostWithUserState } from "@/front/types/post.schema"

// Parcourt l'arbre récursivement et met à jour les compteurs du commentaire ciblé
function applyVoteInTree(
    comments: CommentWithChildren[],
    commentId: string,
    prev: VoteCommentInput["prev"],
    next: VoteCommentInput["next"],
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

const POST_ROOT = ["posts"] as const

// ─── Query options (exportés pour le prefetch SSR) ───────────────────────────

export const postQueries = {
    all: POST_ROOT,

    lists: () =>
        queryOptions({
            queryKey: [...POST_ROOT, "list"] as const,
            queryFn: fetchPosts,
            staleTime: 1000 * 60 * 5,
        }),

    detail: (id: string) =>
        queryOptions({
            queryKey: [...POST_ROOT, "detail", id] as const,
            queryFn: () => fetchPostById(id),
            staleTime: 1000 * 60 * 5,
        }),

    comments: (postId: string) =>
        queryOptions({
            queryKey: [...POST_ROOT, "comments", postId] as const,
            queryFn: () => fetchCommentsByPostId(postId),
            staleTime: 1000 * 60 * 2,
            enabled: !!postId,
        }),
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const usePosts = () => useQuery(postQueries.lists())

export const usePostsByAuthor = (authorId: string | undefined) =>
    useQuery({
        queryKey: [...POST_ROOT, "author", authorId] as const,
        queryFn: () => fetchPostsByAuthor(authorId!),
        staleTime: 1000 * 60 * 5,
        enabled: !!authorId,
    })

export const usePostById = (id: string) => useQuery(postQueries.detail(id))

export const useCommentsByPostId = (postId: string) => useQuery(postQueries.comments(postId))

// ─── Mutations ───────────────────────────────────────────────────────────────

export const useCreatePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createPost,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [...POST_ROOT, "list"] }),
    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreatePostInput> }) => updatePost(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: POST_ROOT }),
    })
}

export const useVoteComment = (postId: string) => {
    const queryClient = useQueryClient()
    const commentsKey = postQueries.comments(postId).queryKey

    return useMutation({
        mutationFn: (input: VoteCommentInput) => voteComment(input),

        // Étape 1 : mise à jour immédiate du cache (avant la réponse serveur)
        onMutate: async ({ commentId, prev, next }) => {
            await queryClient.cancelQueries({ queryKey: commentsKey })
            const previous = queryClient.getQueryData<CommentWithChildren[]>(commentsKey)
            queryClient.setQueryData<CommentWithChildren[]>(commentsKey, (old = []) =>
                applyVoteInTree(old, commentId, prev, next)
            )
            return { previous }
        },

        // Étape 2 : si le serveur échoue, on restaure l'état d'avant
        onError: (_err, _input, context) => {
            if (context?.previous) {
                queryClient.setQueryData(commentsKey, context.previous)
            }
        },

        // Étape 3 : dans tous les cas, on resync avec le serveur
        onSettled: () => queryClient.invalidateQueries({ queryKey: commentsKey }),
    })
}

export const useCreateComment = (postId: string) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (input: CreateCommentInput) => createComment(input),
        onMutate: () => {
            // Optimistic update: increment commentCount in the list cache immediately
            queryClient.setQueryData<PostWithUserState[]>(
                postQueries.lists().queryKey,
                (old = []) => old.map((p) =>
                    p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p
                )
            )
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [...POST_ROOT, "comments", postId] })
            queryClient.invalidateQueries({ queryKey: [...POST_ROOT, "detail", postId] })
            queryClient.invalidateQueries({ queryKey: [...POST_ROOT, "list"] })
        },
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deletePost,
        onMutate: async (postId: string) => {
            const listKey = postQueries.lists().queryKey
            await queryClient.cancelQueries({ queryKey: listKey })
            const previousPosts = queryClient.getQueryData<PostWithUserState[]>(listKey)
            queryClient.setQueryData<PostWithUserState[]>(listKey, (old = []) =>
                old.filter((post) => post.id !== postId)
            )
            return { previousPosts }
        },
        onError: (
            _err: unknown,
            _postId: string,
            context: { previousPosts: PostWithUserState[] | undefined } | undefined
        ) => {
            if (context?.previousPosts !== undefined) {
                queryClient.setQueryData(postQueries.lists().queryKey, context.previousPosts)
            }
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: [...POST_ROOT, "list"] }),
    })
}

export const useToggleSavePost = (postId: string) => {
    const queryClient = useQueryClient()
    const listKey = postQueries.lists().queryKey
    return useMutation({
        mutationFn: () => toggleSavePost(postId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: listKey })
            const previous = queryClient.getQueryData<PostWithUserState[]>(listKey)
            queryClient.setQueryData<PostWithUserState[]>(listKey, (old = []) =>
                old.map((p) =>
                    p.id === postId
                        ? { ...p, isSaved: !p.isSaved, saveCount: p.isSaved ? p.saveCount - 1 : p.saveCount + 1 }
                        : p
                )
            )
            return { previous }
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(listKey, context.previous)
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: listKey }),
    })
}

export const useToggleVotePost = (postId: string) => {
    const queryClient = useQueryClient()
    const listKey = postQueries.lists().queryKey
    return useMutation({
        mutationFn: () => toggleVotePost(postId),
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: listKey })
            const previous = queryClient.getQueryData<PostWithUserState[]>(listKey)
            queryClient.setQueryData<PostWithUserState[]>(listKey, (old = []) =>
                old.map((p) =>
                    p.id === postId
                        ? { ...p, isVoted: !p.isVoted, upvoteCount: p.isVoted ? p.upvoteCount - 1 : p.upvoteCount + 1 }
                        : p
                )
            )
            return { previous }
        },
        onError: (_err, _vars, context) => {
            if (context?.previous) queryClient.setQueryData(listKey, context.previous)
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: listKey }),
    })
}

export const useReportPost = (postId: string) => {
    return useMutation({
        mutationFn: () => reportPost(postId),
    })
}

export const useFollowedCategoryPosts = () =>
    useQuery({
        queryKey: ["posts", "followed"] as const,
        queryFn: fetchFollowedCategoryPosts,
        staleTime: 1000 * 60,
    })

export const useSavedPosts = () =>
    useQuery({
        queryKey: [...POST_ROOT, "saved"] as const,
        queryFn: fetchSavedPosts,
        staleTime: 1000 * 60 * 5,
    })
