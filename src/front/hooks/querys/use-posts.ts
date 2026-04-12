import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    createPost,
    deletePost,
    fetchCommentsByPostId,
    fetchPostById,
    fetchPosts,
    updatePost,
    type CreatePostInput,
} from "@/front/lib/api/posts"
import { PostWithAuthorAndCategory } from "@/front/types/post.schema"

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
        }),
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const usePosts = () => useQuery(postQueries.lists())

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

export const useDeletePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deletePost,
        onMutate: async (postId: string) => {
            const listKey = postQueries.lists().queryKey
            await queryClient.cancelQueries({ queryKey: listKey })
            const previousPosts = queryClient.getQueryData<PostWithAuthorAndCategory[]>(listKey)
            queryClient.setQueryData<PostWithAuthorAndCategory[]>(listKey, (old = []) =>
                old.filter((post) => post.id !== postId)
            )
            return { previousPosts }
        },
        onError: (
            _err: unknown,
            _postId: string,
            context: { previousPosts: PostWithAuthorAndCategory[] | undefined } | undefined
        ) => {
            if (context?.previousPosts !== undefined) {
                queryClient.setQueryData(postQueries.lists().queryKey, context.previousPosts)
            }
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: [...POST_ROOT, "list"] }),
    })
}
