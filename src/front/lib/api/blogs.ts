export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED"
export type BlogTag = "VIDEO" | "MOTION" | "OUTILS"

export const BLOG_TAGS: { value: BlogTag; label: string }[] = [
    { value: "VIDEO", label: "Vidéo" },
    { value: "MOTION", label: "Motion" },
    { value: "OUTILS", label: "Outils" },
]

export interface Blog {
    id: string
    title: string
    content: string
    coverUrl?: string | null
    tag: BlogTag
    status: BlogStatus
    authorId: string
    createdAt: Date
    updatedAt: Date
}

export interface CreateBlogInput {
    title: string
    content: string
    tag: BlogTag
    coverUrl?: string | null
    status?: BlogStatus
}

export interface UpdateBlogInput {
    title?: string
    content?: string
    tag?: BlogTag
    coverUrl?: string | null
    status?: BlogStatus
}

export async function fetchBlogs(): Promise<Blog[]> {
    const response = await fetch("/api/blogs", { method: "GET", cache: "no-store" })
    if (!response.ok) throw new Error("Erreur lors de la récupération des blogs")
    const data = await response.json()
    return data.blogs
}

export async function fetchBlogById(blogId: string): Promise<Blog> {
    const response = await fetch(`/api/blogs/${blogId}`, { method: "GET", cache: "no-store" })
    if (!response.ok) {
        if (response.status === 404) throw new Error("Blog not found")
        throw new Error("Erreur lors de la récupération du blog")
    }
    const data = await response.json()
    return data.blog
}

export async function createBlog(input: CreateBlogInput): Promise<Blog> {
    const response = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    })
    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || "Erreur lors de la création du blog")
    }
    const data = await response.json()
    return data.blog
}

export async function updateBlog(blogId: string, input: UpdateBlogInput): Promise<Blog> {
    const response = await fetch(`/api/blogs/${blogId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    })
    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || "Erreur lors de la mise à jour du blog")
    }
    const data = await response.json()
    return data.blog
}

export async function deleteBlog(blogId: string): Promise<void> {
    const response = await fetch(`/api/blogs/${blogId}`, { method: "DELETE" })
    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || "Erreur lors de la suppression du blog")
    }
}
