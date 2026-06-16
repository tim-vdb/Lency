"use client"

import { useState } from "react"
import { AlertTriangle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/front/components/ui/card"
import { Button } from "@/front/components/ui/button"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/front/components/ui/alert-dialog"
import { useDeleteUser } from "@/front/queries/users"
import { useUser } from "@/front/states/contexts/user.context"

export default function ProfileDelete() {
    const user = useUser()
    const { mutate: deleteUser, isPending } = useDeleteUser()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    function handleDelete() {
        if (!user?.id) return
        deleteUser(user.id, {
            onSuccess: () => {
                setOpen(false)
                router.push("/")
            },
            onError: () => {
                setOpen(false)
                toast.error("Une erreur est survenue lors de la suppression du compte.")
            },
        })
    }

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
                            Cette action est permanente et irréversible. Toutes vos données seront définitivement supprimées.
                        </p>
                    </div>

                    <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-fit">
                                Supprimer mon compte
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Cette action est irréversible. Votre compte et toutes vos données associées seront définitivement supprimés.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isPending}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {isPending && <Loader2 className="size-4 animate-spin" />}
                                    Supprimer définitivement
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </CardContent>
        </Card>
    )
}
