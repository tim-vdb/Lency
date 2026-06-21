/**
 * Helpers API pour gérer les communautés
 * 
 * Ces fonctions sont utilisées par React Query pour:
 * - Récupérer les données (GET)
 * - Créer/Modifier/Supprimer des données (POST/PUT/DELETE)
 */

export interface Category {
    id: string
    name: string
    slug: string
    description?: string
    iconUrl?: string
    bannerUrl?: string
    rules?: string
    subscriberCount: number
    postCount: number
    lastPostAt?: Date
    createdAt: Date
    updatedAt: Date
    _count: {
        posts: number
        ressources: number
    }
}

export type CategoryWithCounts = Category

// Type pour créer une nouvelle communauté
export interface CreateCategoryInput {
    name: string
    slug: string
    description?: string
    iconUrl?: string
    bannerUrl?: string
    rules?: string
}

/**
 * Récupère toutes les communautés
 * Utilisé avec useQuery
 */
export async function fetchCategories(): Promise<Category[]> {
    const response = await fetch('/api/categories', {
        method: 'GET',
        // cache: 'no-store' pour Next.js - force le fetch à chaque fois
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des communautés')
    }

    const data = await response.json()
    return data.categories
}

export async function fetchCategoryById(categoryId: string): Promise<Category> {
    const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'GET',
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la communauté')
    }

    const data = await response.json()
    return data.category
}

/**
 * Crée une nouvelle communauté
 * Utilisé avec useMutation
 */
export async function createCategory(input: CreateCategoryInput): Promise<Category> {
    const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    })

    if (!response.ok) {
        // Essayer de récupérer le message d'erreur de l'API
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors de la création de la communauté')
    }

    const data = await response.json()
    return data.category
}

/**
 * Supprime une communauté
 * Utilisé avec useMutation
 */
export async function deleteCategory(categoryId: string): Promise<void> {
    const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors de la suppression de la communauté')
    }
}

export async function fetchCategoryBySlug(slug: string): Promise<Category> {
    const response = await fetch(`/api/categories/slug/${slug}`, {
        method: 'GET',
        cache: 'no-store',
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération de la communauté')
    }
    const data = await response.json()
    return data.category
}

export async function fetchPostsByCategory(categoryId: string): Promise<import('@/front/schemas/types/post.type').PostWithUserState[]> {
    const response = await fetch(`/api/categories/${categoryId}/posts`, {
        method: 'GET',
        cache: 'no-store',
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des posts de la communauté')
    }
    const data = await response.json()
    return data.posts
}

export async function toggleFollowCategory(categoryId: string): Promise<{ following: boolean }> {
    const response = await fetch(`/api/categories/${categoryId}/follow`, { method: 'POST' })
    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors du suivi de la communauté')
    }
    return response.json()
}

export async function getCategoryNotifyStatus(categoryId: string): Promise<{ subscribed: boolean }> {
    const response = await fetch(`/api/categories/${categoryId}/notify`, { method: "GET", cache: "no-store" });
    if (!response.ok) throw new Error("Erreur statut notification communauté");
    return response.json();
}

export async function toggleCategoryNotify(categoryId: string): Promise<{ subscribed: boolean }> {
    const response = await fetch(`/api/categories/${categoryId}/notify`, { method: "POST" });
    if (!response.ok) throw new Error("Erreur toggle notification communauté");
    return response.json();
}

export async function fetchFollowedCategories(): Promise<CategoryWithCounts[]> {
    const response = await fetch("/api/categories/followed", { cache: "no-store" });
    if (!response.ok) {
        const { error } = await response.json().catch(() => ({}));
        throw new Error(error ?? "Erreur lors de la récupération des communautés suivies");
    }
    return (await response.json()).categories;
}

export async function getFollowStatus(categoryId: string): Promise<{ following: boolean }> {
    const response = await fetch(`/api/categories/${categoryId}/follow`, {
        method: 'GET',
        cache: 'no-store',
    })
    if (!response.ok) {
        throw new Error('Erreur lors de la récupération du statut de suivi')
    }
    return response.json()
}

/**
 * Met à jour une communauté
 * Utilisé avec useMutation
 */
export async function updateCategory(
    categoryId: string,
    input: Partial<CreateCategoryInput>
): Promise<Category> {
    const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors de la mise à jour de la communauté')
    }

    const data = await response.json()
    return data.category
}
