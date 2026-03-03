/**
 * Helpers API pour gérer les catégories
 * 
 * Ces fonctions sont utilisées par React Query pour:
 * - Récupérer les données (GET)
 * - Créer/Modifier/Supprimer des données (POST/PUT/DELETE)
 */

// Type pour une catégorie (basé sur votre schéma Prisma)
export interface Category {
    id: string
    name: string
    slug: string
    description?: string
    iconUrl?: string
    bannerUrl?: string
    rules?: string
    lastPostAt?: Date
    createdAt: Date
    updatedAt: Date
}

// Type pour créer une nouvelle catégorie
export interface CreateCategoryInput {
    name: string
    slug: string
    description?: string
    iconUrl?: string
    bannerUrl?: string
    rules?: string
}

/**
 * Récupère toutes les catégories
 * Utilisé avec useQuery
 */
export async function fetchCategories(): Promise<Category[]> {
    const response = await fetch('/api/categories', {
        method: 'GET',
        // cache: 'no-store' pour Next.js - force le fetch à chaque fois
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories')
    }

    const data = await response.json()
    return data.categories
}

/**
 * Crée une nouvelle catégorie
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
        throw new Error(error.error || 'Erreur lors de la création de la catégorie')
    }

    const data = await response.json()
    return data.category
}

/**
 * Supprime une catégorie
 * Utilisé avec useMutation
 */
export async function deleteCategory(categoryId: string): Promise<void> {
    const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors de la suppression de la catégorie')
    }
}

/**
 * Met à jour une catégorie
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
        throw new Error(error.error || 'Erreur lors de la mise à jour de la catégorie')
    }

    const data = await response.json()
    return data.category
}
