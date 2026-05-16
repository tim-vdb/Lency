/**
 * Helpers API pour gérer les projets
 */

export type ProjectStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED"

export interface MapLocation {
    id: string
    name: string
    latitude: number
    longitude: number
    description?: string
}

export interface Project {
    id: string
    title: string
    description: string
    status: ProjectStatus
    ownerId: string
    mapLocationId?: string
    mapLocation?: MapLocation
    createdAt: Date
    updatedAt: Date
}

export interface CreateProjectInput {
    title: string
    description: string
    mapLocation?: {
        name: string
        latitude: number
        longitude: number
        description?: string
    }
}

export interface UpdateProjectInput {
    title?: string
    description?: string
    status?: ProjectStatus
    mapLocation?: {
        name?: string
        latitude?: number
        longitude?: number
        description?: string
    }
}

export async function fetchProjects(): Promise<Project[]> {
    const response = await fetch("/api/projects", {
        method: "GET",
        cache: "no-store",
    })

    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des projets")
    }

    const data = await response.json()
    return data.projects
}

export async function fetchProjectById(projectId: string): Promise<Project> {
    const response = await fetch(`/api/projects/${projectId}`, {
        method: "GET",
        cache: "no-store",
    })

    if (!response.ok) {
        if (response.status === 404) throw new Error("Project not found")
        throw new Error("Erreur lors de la récupération du projet")
    }

    const data = await response.json()
    return data.project
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
    const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || "Erreur lors de la création du projet")
    }

    const data = await response.json()
    return data.project
}

export async function updateProject(
    projectId: string,
    input: UpdateProjectInput
): Promise<Project> {
    const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || "Erreur lors de la mise à jour du projet")
    }

    const data = await response.json()
    return data.project
}

export async function deleteProject(projectId: string): Promise<void> {
    const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || "Erreur lors de la suppression du projet")
    }
}
