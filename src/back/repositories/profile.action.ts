'use server';

import { auth } from '@/back/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/back/lib/prisma';

export const deleteUserAccount = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return {
                success: false,
                error: 'Non authentifié',
            };
        }

        // Supprimer l'utilisateur et toutes les données associées
        // Les contraintes CASCADE dans Prisma vont supprimer automatiquement les sessions et comptes liés
        await prisma.user.delete({
            where: { id: session.user.id },
        });

        // Déconnecter l'utilisateur
        await auth.api.signOut({
            headers: await headers(),
        });

        return {
            success: true,
            message: 'Compte supprimé avec succès',
        };
    } catch (error) {
        console.error('Erreur lors de la suppression du compte:', error);
        return {
            success: false,
            error: 'Une erreur est survenue lors de la suppression du compte',
        };
    }
};

export const updateUserProfile = async (data: {
    firstname?: string;
    lastname?: string;
    username?: string;
    email?: string;
    phone?: string;
    bio?: string;
    avatarUrl?: string;
    portfolio?: string;
    cv?: string;
}) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session?.user?.id) {
            return {
                success: false,
                error: 'Non authentifié',
            };
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: {
                ...data,
            },
        });

        return {
            success: true,
            user: updatedUser,
        };
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        return {
            success: false,
            error: 'Une erreur est survenue lors de la mise à jour du profil',
        };
    }
};
