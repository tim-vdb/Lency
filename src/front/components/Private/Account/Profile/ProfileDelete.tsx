'use client';
import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { useDeleteUser } from '@/front/queries/users';
import { useRouter } from 'next/navigation';
import { useUser } from "@/front/states/contexts/user.context";

export default function ProfileDelete() {
    const user = useUser()
    const deleteUserMutation = useDeleteUser();
    const router = useRouter();

    const handleDelete = async () => {
        if (!window.confirm("Êtes-vous sûr ? Cette action est irréversible.")) return;

        if (!user?.id) {
            alert('Erreur : utilisateur non identifié');
            return;
        }

        deleteUserMutation.mutate(user.id, {
            onSuccess: () => {
                router.push('/');
            },
            onError: (error) => {
                console.error(error);
                alert('Erreur lors de la suppression');
            },
        });
    };

    return (
        <Card className="border-destructive/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="size-5" />
                    Zone de danger
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div>
                        <h4 className="font-medium">Supprimer votre compte</h4>
                        <p className="text-sm text-muted-foreground">
                            Cette action est permanente et irréversible.
                        </p>
                    </div>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={deleteUserMutation.isPending}
                    >
                        {deleteUserMutation.isPending ? "Suppression..." : "Supprimer mon compte"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}