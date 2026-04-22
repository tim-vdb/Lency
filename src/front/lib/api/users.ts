import { UserProfile } from "@/front/types/user.schema";

/**
 * Helpers API pour gérer les utilisateurs
 *
 * Ces fonctions sont utilisées par React Query pour:
 * - Récupérer les données (GET)
 * - Créer/Modifier/Supprimer des données (POST/PUT/DELETE)
 */

// Type pour un utilisateur
export interface User {
    id: string;
    email: string;
    name?: string;
    firstname?: string;
    lastname?: string;
    username?: string;
    phone?: string;
    bio?: string;
    avatarUrl?: string;
    portfolio?: string;
    cv?: string;
    role?: string;
    emailVerified?: boolean;
    image?: string;
    isPremium?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

// Type pour mettre à jour un utilisateur
export interface UpdateUserInput {
    firstname?: string;
    lastname?: string;
    username?: string;
    email?: string;
    phone?: string;
    bio?: string;
    avatarUrl?: string;
    portfolio?: string;
    cv?: string;
}

/**
 * Récupère tous les utilisateurs
 * Utilisé avec useQuery
 */
export async function fetchUsers(): Promise<User[]> {
    const response = await fetch('/api/users', {
        method: 'GET',
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des utilisateurs')
    }

    const data = await response.json()
    return data.users ?? data
}

/**
 * Récupère un utilisateur par son ID
 * Utilisé avec useQuery
 */
export async function fetchUserById(userId: string): Promise<User> {
    const response = await fetch(`/api/users/${userId}`, {
        method: 'GET',
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération de l\'utilisateur')
    }

    const data = await response.json()
    return data.user ?? data
}

/**
 * Récupère un utilisateur par son username (profil complet)
 */
export async function fetchUserByUsername(username: string): Promise<UserProfile> {
    const response = await fetch(`/api/users/username/${encodeURIComponent(username)}`, {
        method: 'GET',
        cache: 'no-store',
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors de la récupération du profil')
    }

    return response.json()
}

/**
 * Met à jour un utilisateur
 * Utilisé avec useMutation
 */
export async function updateUser(
    userId: string,
    input: UpdateUserInput
): Promise<User> {
    const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors de la mise à jour du profil')
    }

    const data = await response.json()
    return data.user
}

export interface ChangePasswordInput {
    currentPassword: string;
    newPassword: string;
}

/**
 * Change le mot de passe de l'utilisateur connecté
 * Utilisé avec useMutation
 */
export async function changePassword(input: ChangePasswordInput): Promise<void> {
    const response = await fetch('/api/users/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.error || 'Erreur lors du changement de mot de passe');
    }
}

/**
 * Supprime un utilisateur (ou son propre compte)
 * Utilisé avec useMutation
 */
export async function deleteUser(userId: string): Promise<void> {
    const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors de la suppression du compte')
    }
}

export interface VerifyEmailChangeInput {
    currentPassword: string;
    newEmail: string;
}

/**
 * Demande un changement d'email
 * Génère un token, sauvegarde pendingEmail, envoie email de confirmation
 * Utilisé avec useMutation
 */
export async function verifyEmailChange(input: VerifyEmailChangeInput): Promise<void> {
    const response = await fetch('/api/users/verify-email-change', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors de la demande de changement d\'email')
    }
}
