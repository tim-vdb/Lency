import { ProjectLevel, ProjectStatus, ProjectType, RemunerationType, Visibility, WorkMode } from "@/back/generated/prisma_client/edge";
import { CommentWithChildren } from "@/front/schemas/types/post.type";
import { ProjectWithOwner } from "@/front/schemas/types/project.type";

export type Project = ProjectWithOwner;

export interface CreateProjectInput {
    title: string;
    description: string;
    bannerUrl?: string;
    projectType?: ProjectType;
    remunerationType?: RemunerationType;
    level?: ProjectLevel;
    workMode?: WorkMode;
    startDate?: string;
    roles?: string[];
    visibility?: Visibility;
    city?: string;
}

export type MyProject = { id: string; title: string; ownerId: string };

export async function fetchMyDraftProjects(): Promise<ProjectWithOwner[]> {
    const res = await fetch("/api/projects/drafts", { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur fetch brouillons projets");
    return (await res.json()).projects;
}

export async function fetchMyProjects(): Promise<MyProject[]> {
    const res = await fetch("/api/projects/mine", { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur fetch mes projets");
    return (await res.json()).projects;
}

export async function createProject(input: CreateProjectInput): Promise<ProjectWithOwner> {
    const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!res.ok) {
        const text = await res.text(); // lire en brut d'abord
        let error: Record<string, string> = {};
        try {
            error = JSON.parse(text);
        } catch {
            // la réponse n'est pas du JSON (HTML d'erreur Next.js, string vide, etc.)
        }
        console.error(`Erreur création projet [${res.status}]:`, text);
        throw new Error(error.error || error.message || `Erreur ${res.status}`);
    }
    return (await res.json()).project;
}

export async function fetchProjects(): Promise<ProjectWithOwner[]> {
    const res = await fetch("/api/projects", { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur lors de la récupération des projets");
    return (await res.json()).projects;
}

export async function fetchProjectById(projectId: string): Promise<ProjectWithOwner> {
    const res = await fetch(`/api/projects/${projectId}`, { cache: "no-store" });
    if (res.status === 403) throw new Error("FORBIDDEN");
    if (!res.ok) throw new Error("Erreur lors de la récupération du projet");
    return (await res.json()).project;
}

export async function fetchProjectComments(projectId: string): Promise<CommentWithChildren[]> {
    const res = await fetch(`/api/projects/${projectId}/comments`, { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur lors de la récupération des commentaires");
    return (await res.json()).comments;
}

export interface CreateProjectCommentInput {
    projectId: string;
    content: string;
    parentId?: string;
    imageUrls?: string[];
    videoUrls?: string[];
    audioUrls?: string[];
}

export interface UpdateProjectInput {
    title?: string;
    description?: string;
    bannerUrl?: string;
    projectType?: ProjectType;
    remunerationType?: RemunerationType;
    level?: ProjectLevel;
    workMode?: WorkMode;
    startDate?: string;
    roles?: string[];
    visibility?: Visibility;
    city?: string;
    status?: ProjectStatus;
}

export async function updateProject(projectId: string, input: UpdateProjectInput): Promise<ProjectWithOwner> {
    const res = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || "Erreur lors de la mise à jour du projet");
    }
    return (await res.json()).project;
}

export async function deleteProject(projectId: string): Promise<void> {
    const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || "Erreur lors de la suppression du projet");
    }
}

export async function reportProject(projectId: string, reason?: string): Promise<void> {
    const res = await fetch(`/api/projects/${projectId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
    });
    if (!res.ok && res.status !== 204) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || "Erreur lors du signalement");
    }
}

export async function createProjectComment(input: CreateProjectCommentInput): Promise<CommentWithChildren> {
    const res = await fetch(`/api/projects/${input.projectId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: input.content,
            parentId: input.parentId,
            imageUrls: input.imageUrls,
            videoUrls: input.videoUrls,
            audioUrls: input.audioUrls,
        }),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || "Erreur lors de la création du commentaire");
    }
    return (await res.json()).comment;
}
