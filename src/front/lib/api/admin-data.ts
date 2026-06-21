import type { AdminUser, AdminProject, AdminCategory, AdminPost, AdminResource } from "@/front/schemas/types/admin-data.type"

async function handleResponse<T>(res: Response): Promise<T> {
    if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Erreur serveur" }))
        throw new Error(error ?? "Erreur serveur")
    }
    return res.json()
}

// ─── Users ───────────────────────────────────────────────────────────────────

export async function fetchAdminUsers(): Promise<AdminUser[]> {
    const res = await fetch("/api/admin/users", { cache: "no-store" })
    const data = await handleResponse<{ users: AdminUser[] }>(res)
    return data.users
}

export async function patchAdminUser(id: string, body: { role?: string }): Promise<AdminUser> {
    const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    const data = await handleResponse<{ user: AdminUser }>(res)
    return data.user
}

export async function deleteAdminUser(id: string): Promise<void> {
    const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
    await handleResponse<unknown>(res)
}

// ─── Projects ────────────────────────────────────────────────────────────────

export async function fetchAdminProjects(): Promise<AdminProject[]> {
    const res = await fetch("/api/admin/projects", { cache: "no-store" })
    const data = await handleResponse<{ projects: AdminProject[] }>(res)
    return data.projects
}

export async function patchAdminProject(id: string, body: { status?: string; visibility?: string }): Promise<AdminProject> {
    const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    const data = await handleResponse<{ project: AdminProject }>(res)
    return data.project
}

export async function deleteAdminProject(id: string): Promise<void> {
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" })
    await handleResponse<unknown>(res)
}

// ─── Categories ──────────────────────────────────────────────────────────────

export async function fetchAdminCategories(): Promise<AdminCategory[]> {
    const res = await fetch("/api/admin/categories", { cache: "no-store" })
    const data = await handleResponse<{ categories: AdminCategory[] }>(res)
    return data.categories
}

export async function createAdminCategory(body: { name: string; slug: string; description?: string; visibility?: string; isNSFW?: boolean }): Promise<AdminCategory> {
    const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    const data = await handleResponse<{ category: AdminCategory }>(res)
    return data.category
}

export async function patchAdminCategory(id: string, body: { name?: string; slug?: string; description?: string; visibility?: string; isNSFW?: boolean }): Promise<AdminCategory> {
    const res = await fetch(`/api/admin/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    const data = await handleResponse<{ category: AdminCategory }>(res)
    return data.category
}

export async function deleteAdminCategory(id: string): Promise<void> {
    const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" })
    await handleResponse<unknown>(res)
}

// ─── Posts ───────────────────────────────────────────────────────────────────

export async function fetchAdminPosts(): Promise<AdminPost[]> {
    const res = await fetch("/api/admin/posts", { cache: "no-store" })
    const data = await handleResponse<{ posts: AdminPost[] }>(res)
    return data.posts
}

export async function patchAdminPost(id: string, body: { isPublished?: boolean; isLocked?: boolean }): Promise<AdminPost> {
    const res = await fetch(`/api/admin/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    })
    const data = await handleResponse<{ post: AdminPost }>(res)
    return data.post
}

export async function deleteAdminPost(id: string): Promise<void> {
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" })
    await handleResponse<unknown>(res)
}

// ─── Resources ───────────────────────────────────────────────────────────────

export async function fetchAdminResources(): Promise<AdminResource[]> {
    const res = await fetch("/api/admin/resources", { cache: "no-store" })
    const data = await handleResponse<{ resources: AdminResource[] }>(res)
    return data.resources
}

export async function deleteAdminResource(id: string): Promise<void> {
    const res = await fetch(`/api/admin/resources/${id}`, { method: "DELETE" })
    await handleResponse<unknown>(res)
}
