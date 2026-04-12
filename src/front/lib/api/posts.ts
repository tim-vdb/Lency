import { CommentWithAuthor, PostWithAuthorAndCategory } from "@/front/types/post.schema";
export interface CreatePostInput {
    title: string
    content: string
    categoryId: string
}

export async function fetchPosts(): Promise<PostWithAuthorAndCategory[]> {
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

export async function fetchCommentsByPostId(postId: string): Promise<CommentWithAuthor[]> {
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

export async function deletePost(postId: string): Promise<void> {
    const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors de la suppression du post')
    }
}
