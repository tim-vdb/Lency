import { queryOptions, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    createBlog,
    deleteBlog,
    fetchBlogById,
    fetchBlogs,
    updateBlog,
    type Blog,
    type UpdateBlogInput,
} from "@/front/lib/api/blogs"

const BLOG_ROOT = ["blogs"] as const

// ─── Query options (exportés pour le prefetch SSR) ────────────────────────────

export const blogQueries = {
    all: BLOG_ROOT,

    lists: () =>
        queryOptions({
            queryKey: [...BLOG_ROOT, "list"] as const,
            queryFn: fetchBlogs,
            staleTime: 1000 * 60 * 5,
        }),

    detail: (id: string) =>
        queryOptions({
            queryKey: [...BLOG_ROOT, "detail", id] as const,
            queryFn: () => fetchBlogById(id),
            staleTime: 1000 * 60 * 5,
        }),
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const useBlogs = () => useQuery(blogQueries.lists())

export const useBlogById = (id: string) => useQuery(blogQueries.detail(id))

// ─── Mutations ────────────────────────────────────────────────────────────────

export const useCreateBlog = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createBlog,
        onSuccess: () =>
            queryClient.invalidateQueries({ queryKey: [...BLOG_ROOT, "list"] }),
    })
}

export const useUpdateBlog = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateBlogInput }) =>
            updateBlog(id, data),
        onSuccess: (_data, { id }) => {
            queryClient.invalidateQueries({ queryKey: [...BLOG_ROOT, "list"] })
            queryClient.invalidateQueries({ queryKey: [...BLOG_ROOT, "detail", id] })
        },
    })
}

export const useDeleteBlog = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteBlog,
        onMutate: async (blogId: string) => {
            const listKey = blogQueries.lists().queryKey
            await queryClient.cancelQueries({ queryKey: listKey })
            const previousBlogs = queryClient.getQueryData<Blog[]>(listKey)
            queryClient.setQueryData<Blog[]>(listKey, (old = []) =>
                old.filter((b) => b.id !== blogId)
            )
            return { previousBlogs }
        },
        onError: (
            _err: unknown,
            _blogId: string,
            context: { previousBlogs: Blog[] | undefined } | undefined
        ) => {
            if (context?.previousBlogs !== undefined) {
                queryClient.setQueryData(blogQueries.lists().queryKey, context.previousBlogs)
            }
        },
        onSettled: () =>
            queryClient.invalidateQueries({ queryKey: [...BLOG_ROOT, "list"] }),
    })
}
