/**
 * Helpers API pour gérer les mails (ContactMessage)
 *
 * Ces fonctions sont utilisées par React Query pour:
 * - Récupérer les données (GET)
 * - Créer/Modifier/Supprimer des données (POST/PATCH/DELETE)
 */

export type ContactType =
    | "SUPPORT_TECHNIQUE"
    | "CONTACT_GENERAL"
    | "FACTURATION"
    | "PARTENARIAT"
    | "AUTRE"

export type ContactStatus =
    | "EN_ATTENTE"
    | "EN_COURS"
    | "RESOLU"
    | "FERME"

// Type pour un mail (basé sur le schéma Prisma ContactMessage)
export interface Mail {
    id: string
    prenom: string
    nom: string
    email: string
    sujet: string
    message: string
    type: ContactType
    status: ContactStatus
    createdAt: Date
    updatedAt: Date
}

// Type pour créer un nouveau mail
export interface CreateMailInput {
    prenom: string
    nom: string
    email: string
    sujet: string
    message: string
    type?: ContactType
}

/**
 * Récupère tous les mails
 * Utilisé avec useQuery
 */
export async function fetchMails(): Promise<Mail[]> {
    const response = await fetch('/api/mails', {
        method: 'GET',
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération des mails')
    }

    const data = await response.json()
    return data.mails
}

/**
 * Récupère un mail par son id
 * Utilisé avec useQuery
 */
export async function fetchMailById(mailId: string): Promise<Mail> {
    const response = await fetch(`/api/mails/${mailId}`, {
        method: 'GET',
        cache: 'no-store',
    })

    if (!response.ok) {
        throw new Error('Erreur lors de la récupération du mail')
    }

    const data = await response.json()
    return data.mail
}

/**
 * Crée un nouveau mail
 * Utilisé avec useMutation
 */
export async function createMail(input: CreateMailInput): Promise<Mail> {
    const response = await fetch('/api/mails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(input),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors de la création du mail')
    }

    const data = await response.json()
    return data.mail
}

/**
 * Met à jour le statut d'un mail
 * Utilisé avec useMutation
 */
export async function updateMailStatus(mailId: string, status: ContactStatus): Promise<Mail> {
    const response = await fetch(`/api/mails/${mailId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors de la mise à jour du statut du mail')
    }

    const data = await response.json()
    return data.mail
}

/**
 * Supprime un mail
 * Utilisé avec useMutation
 */
export async function deleteMail(mailId: string): Promise<void> {
    const response = await fetch(`/api/mails/${mailId}`, {
        method: 'DELETE',
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        throw new Error(error.error || 'Erreur lors de la suppression du mail')
    }
}