import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    createPost,
    deletePost,
    fetchPostById,
    fetchPosts,
    updatePost,
    type PostWithAuthor,
    type CreatePostInput,
} from "@/front/lib/api/posts"

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
}

// ─── Queries ─────────────────────────────────────────────────────────────────

export const usePosts = () => useQuery(postQueries.lists())

export const usePostById = (id: string) => useQuery(postQueries.detail(id))

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
            const previousPosts = queryClient.getQueryData<PostWithAuthor[]>(listKey)
            queryClient.setQueryData<PostWithAuthor[]>(listKey, (old = []) =>
                old.filter((post) => post.id !== postId)
            )
            return { previousPosts }
        },
        onError: (
            _err: unknown,
            _postId: string,
            context: { previousPosts: PostWithAuthor[] | undefined } | undefined
        ) => {
            if (context?.previousPosts !== undefined) {
                queryClient.setQueryData(postQueries.lists().queryKey, context.previousPosts)
            }
        },
        onSettled: () => queryClient.invalidateQueries({ queryKey: [...POST_ROOT, "list"] }),
    })
}
