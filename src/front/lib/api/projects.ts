import { CommentWithChildren } from "@/front/types/post.schema";
import { ProjectWithOwner } from "@/front/types/project.schema";

export interface CreateProjectInput {
    title: string;
    description: string;
    bannerUrl?: string;
    projectType?: string;
    remunerationType?: "NON_REMUNERE" | "REMUNERE";
    level?: "DEBUTANT" | "INTERMEDIAIRE" | "AVANCE";
    workMode?: "PRESENTIEL" | "DISTANCIEL" | "HYBRIDE";
    startDate?: string;
    roles?: string[];
    visibility?: "PUBLIC" | "PRIVATE" | "MEMBERS_ONLY";
    city?: string;
}

export async function createProject(input: CreateProjectInput): Promise<ProjectWithOwner> {
    const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || "Erreur lors de la création du projet");
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
    imageUrl?: string | null;
    videoUrl?: string | null;
}

export async function createProjectComment(input: CreateProjectCommentInput): Promise<CommentWithChildren> {
    const res = await fetch(`/api/projects/${input.projectId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: input.content,
            parentId: input.parentId,
            imageUrl: input.imageUrl,
            videoUrl: input.videoUrl,
        }),
    });
    if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.error || "Erreur lors de la création du commentaire");
    }
    return (await res.json()).comment;
}
