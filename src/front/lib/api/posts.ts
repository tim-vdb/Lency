import { CommentWithChildren, PostWithAuthorAndCategory, PostWithUserState } from "@/front/schemas/types/post.type";

export interface CreatePostInput {
    title?: string
    content: string
    categoryId: string
    format?: "DESKTOP" | "MOBILE" | "TEXT" | "IMAGE" | "VIDEO" | "AUDIO"
    orientation?: "LANDSCAPE" | "PORTRAIT"
    imageUrl?: string
    videoUrl?: string
    audioUrl?: string
    isPublished?: boolean
}

export async function fetchPosts(): Promise<PostWithUserState[]> {
    const response = await fetch('/api/posts', {
        method: 'GET',
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des posts')
    }

    const data = await response.json()
    return data.posts
}

export async function fetchPostById(postId: string): Promise<PostWithAuthorAndCategory> {
    const response = await fetch(`/api/posts/${postId}`, {
        method: 'GET',
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération du post')
    }

    const data = await response.json()
    return data.post
}

export async function createPost(input: CreatePostInput): Promise<PostWithAuthorAndCategory> {
    const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors de la création du post')
    }

    const data = await response.json()
    return data.post
}

export async function updatePost(
    postId: string,
    input: Partial<CreatePostInput>
): Promise<PostWithAuthorAndCategory> {
    const response = await fetch(`/api/posts/${postId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors de la mise à jour du post')
    }

    const data = await response.json()
    return data.post
}

export async function fetchCommentsByPostId(postId: string): Promise<CommentWithChildren[]> {
    const response = await fetch(`/api/posts/${postId}/comments`, {
        method: 'GET',
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commentaires')
    }

    const data = await response.json()
    return data.comments
}

export interface CreateCommentInput {
    content: string;
    postId: string;
    parentId?: string;
    imageUrl?: string | null;
    videoUrl?: string | null;
}

export async function createComment(input: CreateCommentInput): Promise<CommentWithChildren> {
    const response = await fetch(`/api/posts/${input.postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors de la création du commentaire')
    }

    const data = await response.json()
    return data.comment
}

export interface VoteCommentInput {
    commentId: string;
    postId: string;
    prev: "upvote" | "downvote" | null;
    next: "upvote" | "downvote" | null;
}

export async function voteComment(input: VoteCommentInput): Promise<void> {
    const response = await fetch(
        `/api/posts/${input.postId}/comments/${input.commentId}/vote`,
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

export async function deletePost(postId: string): Promise<void> {
    const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors de la suppression du post')
    }
}

export async function toggleSavePost(postId: string): Promise<{ saved: boolean }> {
    const response = await fetch(`/api/posts/${postId}/save`, { method: 'POST' })
    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors de la sauvegarde du post')
    }
    return response.json()
}

export async function toggleVotePost(postId: string): Promise<{ voted: boolean }> {
    const response = await fetch(`/api/posts/${postId}/vote`, { method: 'POST' })
    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors du vote')
    }
    return response.json()
}

export async function reportPost(postId: string): Promise<void> {
    const response = await fetch(`/api/posts/${postId}/report`, { method: 'POST' })
    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors du signalement du post')
    }
}

export async function fetchPostsByAuthor(authorId: string): Promise<PostWithUserState[]> {
    const response = await fetch(`/api/posts?authorId=${authorId}`, {
        method: 'GET',
        cache: 'no-store',
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des posts')
    }
    const data = await response.json()
    return data.posts
}

export async function fetchMyDraftPosts(): Promise<PostWithUserState[]> {
    const response = await fetch("/api/posts/drafts", { method: "GET", cache: "no-store" });
    if (!response.ok) throw new Error("Erreur lors de la récupération des brouillons");
    return (await response.json()).posts;
}

export async function fetchSavedPosts(): Promise<PostWithUserState[]> {
    const response = await fetch("/api/posts/saved", { method: "GET", cache: "no-store" });
    if (!response.ok) throw new Error("Erreur lors de la récupération des posts enregistrés");
    const data = await response.json();
    return data.posts;
}

export async function fetchFollowedCategoryPosts(): Promise<PostWithUserState[]> {
    const response = await fetch('/api/posts/followed', { method: 'GET', cache: 'no-store' })
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des posts suivis')
    }
    const data = await response.json()
    return data.posts
}
