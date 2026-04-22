import { CommentWithChildren } from "@/front/types/post.schema";
import { ResourceWithUserState } from "@/front/types/resource.schema";

export async function fetchResources(categoryId?: string): Promise<ResourceWithUserState[]> {
    const url = categoryId ? `/api/resources?categoryId=${categoryId}` : "/api/resources";
    const response = await fetch(url, { method: "GET", cache: "no-store" });

    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des ressources");
    }

    const data = await response.json();
    return data.resources;
}

export async function fetchResourceById(resourceId: string): Promise<ResourceWithUserState> {
    const response = await fetch(`/api/resources/${resourceId}`, {
        method: "GET",
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la récupération de la ressource");
    }

    const data = await response.json();
    return data.resource;
}

export async function toggleSaveResource(resourceId: string): Promise<{ saved: boolean }> {
    const response = await fetch(`/api/resources/${resourceId}/save`, { method: "POST" });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Erreur lors de la sauvegarde de la ressource");
    }
    return response.json();
}

export async function toggleVoteResource(resourceId: string): Promise<{ voted: boolean }> {
    const response = await fetch(`/api/resources/${resourceId}/vote`, { method: "POST" });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Erreur lors du vote");
    }
    return response.json();
}

export async function fetchResourceComments(resourceId: string): Promise<CommentWithChildren[]> {
    const response = await fetch(`/api/resources/${resourceId}/comments`, {
        method: "GET",
        cache: "no-store",
    });
    if (!response.ok) {
        throw new Error("Erreur lors de la récupération des commentaires");
    }
    const data = await response.json();
    return data.comments;
}

export interface VoteResourceCommentInput {
    resourceId: string;
    commentId: string;
    prev: "upvote" | "downvote" | null;
    next: "upvote" | "downvote" | null;
}

export async function voteResourceComment(input: VoteResourceCommentInput): Promise<void> {
    const response = await fetch(
        `/api/resources/${input.resourceId}/comments/${input.commentId}/vote`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prev: input.prev, next: input.next }),
        }
    );
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Erreur lors du vote");
    }
}

export interface CreateResourceCommentInput {
    resourceId: string;
    content: string;
    parentId?: string;
}

export async function createResourceComment(
    input: CreateResourceCommentInput
): Promise<CommentWithChildren> {
    const response = await fetch(`/api/resources/${input.resourceId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.content, parentId: input.parentId }),
    });
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || "Erreur lors de la création du commentaire");
    }
    const data = await response.json();
    return data.comment;
}
