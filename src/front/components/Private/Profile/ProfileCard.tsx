'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/back/generated/prisma_client';
import { deleteUserAccount } from '@/back/repositories/profile.action';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/front/components/ui/alert-dialog';
import { Button } from '@/front/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/front/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';

export function ProfileCard({ user }: { user: User | null }) {
    const router = useRouter();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    if (!user) {
        return (
            <Card className="w-full border-red-200 bg-red-50">
                <CardContent className="pt-6">
                    <p className="text-red-600">Impossible de charger les informations du profil.</p>
                </CardContent>
            </Card>
        );
    }

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        setError(null);

        try {
            const result = await deleteUserAccount();

            if (result.success) {
                setSuccess('Votre compte a été supprimé avec succès. Redirection en cours...');
                setTimeout(() => {
                    router.push('/');
                }, 2000);
            } else {
                setError(result.error || 'Une erreur est survenue');
            }
        } catch (err) {
            setError('Une erreur inattendue est survenue');
            console.error('Delete account error:', err);
        } finally {
            setIsDeleting(false);
            setIsDeleteOpen(false);
        }
    };

    return (
        <div className="space-y-6 w-full max-w-2xl mx-auto">
            {/* Affichage du message de succès */}
            {success && (
                <Card className="border-green-200 bg-green-50">
                    <CardContent className="pt-6">
                        <p className="text-green-600">{success}</p>
                    </CardContent>
                </Card>
            )}

            {/* Affichage du message d'erreur */}
            {error && (
                <Card className="border-red-200 bg-red-50">
                    <CardContent className="pt-6">
                        <p className="text-red-600">{error}</p>
                    </CardContent>
                </Card>
            )}

            {/* Carte d'information principale */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        {user.image && (
                            <img
                                src={user.image}
                                alt={user.name || 'Avatar'}
                                className="w-12 h-12 rounded-full object-cover"
                            />
                        )}
                        <div>
                            <div className="text-2xl font-bold">
                                {user.firstname && user.lastname
                                    ? `${user.firstname} ${user.lastname}`
                                    : user.name || 'Utilisateur'}
                            </div>
                            <div className="text-sm text-gray-500 font-normal">@{user.username || 'N/A'}</div>
                        </div>
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {/* Email */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600">Email</h3>
                        <p className="text-base text-gray-900">{user.email}</p>
                    </div>

                    {/* Prénom et Nom */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600">Prénom</h3>
                            <p className="text-base text-gray-900">{user.firstname || 'Non spécifié'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600">Nom</h3>
                            <p className="text-base text-gray-900">{user.lastname || 'Non spécifié'}</p>
                        </div>
                    </div>

                    {/* Téléphone et Bio */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600">Téléphone</h3>
                            <p className="text-base text-gray-900">{user.phone || 'Non spécifié'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600">Statut</h3>
                            <p className="text-base text-gray-900">
                                <span
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${user.isPremium
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {user.isPremium ? '⭐ Premium' : 'Membre'}
                                </span>
                            </p>
                        </div>
                    </div>

                    {/* Bio */}
                    {user.bio && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-600">Bio</h3>
                            <p className="text-base text-gray-900">{user.bio}</p>
                        </div>
                    )}

                    {/* Porfolio et CV */}
                    <div className="grid grid-cols-2 gap-4">
                        {user.portfolio && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600">Portfolio</h3>
                                <a
                                    href={user.portfolio}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-base text-blue-600 hover:underline"
                                >
                                    Voir le portfolio
                                </a>
                            </div>
                        )}
                        {user.cv && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600">CV</h3>
                                <a
                                    href={user.cv}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-base text-blue-600 hover:underline"
                                >
                                    Télécharger CV
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Rôle */}
                    <div>
                        <h3 className="text-sm font-semibold text-gray-600">Rôle</h3>
                        <p className="text-base text-gray-900 capitalize">{user.role || 'MEMBER'}</p>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-xs text-gray-500">
                            <h3 className="font-semibold">Inscription</h3>
                            <p>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                            <h3 className="font-semibold">Dernière modification</h3>
                            <p>{new Date(user.updatedAt).toLocaleDateString('fr-FR')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Carte de suppression du compte */}
            <Card className="border-red-200 bg-red-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        Zone de danger
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Supprimer votre compte</h3>
                        <p className="text-sm text-gray-700 mb-4">
                            Cette action est permanente et irréversible. Tous vos données seront supprimées de
                            la plateforme.
                        </p>
                    </div>

                    <Button
                        onClick={() => setIsDeleteOpen(true)}
                        disabled={isDeleting}
                        variant="destructive"
                        className="w-full"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Suppression en cours...
                            </>
                        ) : (
                            'Supprimer mon compte'
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Dialog de confirmation */}
            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-red-600">Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action est permanente et irréversible. Vous perdrez l'accès à votre compte et
                            à toutes vos données. Tapez votre email pour confirmer : <strong>{user.email}</strong>
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="space-y-4">
                        <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">
                                Confirmez en tapant votre email :
                            </p>
                            <input
                                type="email"
                                placeholder={user.email}
                                disabled={true}
                                value={user.email}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-500 bg-gray-50"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <AlertDialogCancel disabled={isDeleting}>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isDeleting ? (
                                <AlertDialogAction>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Suppression...
                                </AlertDialogAction>
                            ) : (
                                'Supprimer définitivement'
                            )}
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
