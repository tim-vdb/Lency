"use client"

import { useMutation, useQuery, useQueryClient, queryOptions } from "@tanstack/react-query"
import { toast } from "sonner"
import {
    fetchAdminUsers, patchAdminUser, deleteAdminUser,
    fetchAdminProjects, patchAdminProject, deleteAdminProject,
    fetchAdminCategories, createAdminCategory, patchAdminCategory, deleteAdminCategory,
    fetchAdminPosts, patchAdminPost, deleteAdminPost,
    fetchAdminResources, deleteAdminResource,
} from "@/front/lib/api/admin-data"

// ─── Users ───────────────────────────────────────────────────────────────────

const ADMIN_USERS_KEY = ["admin-users"] as const

export const adminUsersQueries = {
    lists: () => queryOptions({ queryKey: ADMIN_USERS_KEY, queryFn: fetchAdminUsers, staleTime: 1000 * 60 }),
}

export const useAdminUsers = () => useQuery(adminUsersQueries.lists())

export const usePatchAdminUser = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: { id: string; role?: string }) => patchAdminUser(id, body),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ADMIN_USERS_KEY })
            toast.success("Utilisateur mis à jour")
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export const useDeleteAdminUser = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => deleteAdminUser(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ADMIN_USERS_KEY })
            toast.success("Utilisateur supprimé")
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

// ─── Projects ────────────────────────────────────────────────────────────────

const ADMIN_PROJECTS_KEY = ["admin-projects"] as const

export const adminProjectsQueries = {
    lists: () => queryOptions({ queryKey: ADMIN_PROJECTS_KEY, queryFn: fetchAdminProjects, staleTime: 1000 * 60 }),
}

export const useAdminProjects = () => useQuery(adminProjectsQueries.lists())

export const usePatchAdminProject = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: { id: string; status?: string; visibility?: string }) => patchAdminProject(id, body),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ADMIN_PROJECTS_KEY })
            toast.success("Projet mis à jour")
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export const useDeleteAdminProject = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => deleteAdminProject(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ADMIN_PROJECTS_KEY })
            toast.success("Projet supprimé")
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

// ─── Categories ──────────────────────────────────────────────────────────────

const ADMIN_CATEGORIES_KEY = ["admin-categories"] as const

export const adminCategoriesQueries = {
    lists: () => queryOptions({ queryKey: ADMIN_CATEGORIES_KEY, queryFn: fetchAdminCategories, staleTime: 1000 * 60 }),
}

export const useAdminCategories = () => useQuery(adminCategoriesQueries.lists())

export const useCreateAdminCategory = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: createAdminCategory,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY })
            toast.success("Communauté créée")
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export const usePatchAdminCategory = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: { id: string; name?: string; slug?: string; description?: string; visibility?: string; isNSFW?: boolean }) => patchAdminCategory(id, body),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY })
            toast.success("Communauté mise à jour")
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export const useDeleteAdminCategory = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => deleteAdminCategory(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ADMIN_CATEGORIES_KEY })
            toast.success("Communauté supprimée")
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

// ─── Posts ───────────────────────────────────────────────────────────────────

const ADMIN_POSTS_KEY = ["admin-posts"] as const

export const adminPostsQueries = {
    lists: () => queryOptions({ queryKey: ADMIN_POSTS_KEY, queryFn: fetchAdminPosts, staleTime: 1000 * 60 }),
}

export const useAdminPosts = () => useQuery(adminPostsQueries.lists())

export const usePatchAdminPost = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, ...body }: { id: string; isPublished?: boolean; isLocked?: boolean }) => patchAdminPost(id, body),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ADMIN_POSTS_KEY })
            toast.success("Post mis à jour")
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export const useDeleteAdminPost = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => deleteAdminPost(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ADMIN_POSTS_KEY })
            toast.success("Post supprimé")
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

// ─── Resources ───────────────────────────────────────────────────────────────

const ADMIN_RESOURCES_KEY = ["admin-resources"] as const

export const adminResourcesQueries = {
    lists: () => queryOptions({ queryKey: ADMIN_RESOURCES_KEY, queryFn: fetchAdminResources, staleTime: 1000 * 60 }),
}

export const useAdminResources = () => useQuery(adminResourcesQueries.lists())

export const useDeleteAdminResource = () => {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => deleteAdminResource(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ADMIN_RESOURCES_KEY })
            toast.success("Ressource supprimée")
        },
        onError: (err: Error) => toast.error(err.message),
    })
}
