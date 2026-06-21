"use client"

import { useState } from "react"
import { AlertTriangle, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/front/components/ui/card"
import { Button } from "@/front/components/ui/button"
import { Input } from "@/front/components/ui/input"
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
import type { Account } from "@/back/generated/prisma_client"

export default function ProfileDelete() {
    const user = useUser() as any
    const { mutate: deleteUser, isPending } = useDeleteUser()
    const [open, setOpen] = useState(false)
    const [password, setPassword] = useState("")
    const [emailSent, setEmailSent] = useState(false)

    const hasPasswordAuth = (user?.accounts as Account[] | undefined ?? []).some(
        (account: Account) => account.providerId === 'credential' && account.password
    )

    function handleDelete() {
        if (!user?.id) return

        if (hasPasswordAuth && !password.trim()) {
            toast.error("Veuillez entrer votre mot de passe")
            return
        }

        deleteUser(
            { userId: user.id, password: hasPasswordAuth ? password : undefined },
            {
                onSuccess: () => {
                    setEmailSent(true)
                    setPassword("")
                    toast.success("Email de confirmation envoyé. Vérifiez votre boîte mail.")
                },
                onError: () => {
                    setOpen(false)
                    toast.error("Une erreur est survenue. Veuillez réessayer.")
                },
            }
        )
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

                    {emailSent ? (
                        <div className="rounded-md bg-blue-50 border border-blue-200 p-4">
                            <p className="text-sm text-blue-900">
                                ✅ <strong>Email de confirmation envoyé</strong>
                            </p>
                            <p className="text-sm text-blue-800 mt-2">
                                Vérifiez votre boîte mail et cliquez sur le lien de confirmation pour supprimer votre compte.
                                Le lien expire dans 24 heures.
                            </p>
                        </div>
                    ) : (
                        <AlertDialog open={open} onOpenChange={setOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" className="w-fit text-white!">
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
                            {hasPasswordAuth && (
                                <div className="space-y-2">
                                    <label htmlFor="delete-password" className="text-sm font-medium">
                                        Confirmez avec votre mot de passe
                                    </label>
                                    <Input
                                        id="delete-password"
                                        type="password"
                                        placeholder="Votre mot de passe"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isPending}
                                    />
                                </div>
                            )}
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isPending}>Annuler</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDelete}
                                    disabled={isPending}
                                    className="bg-destructive text-white hover:bg-destructive/90"
                                >
                                    {isPending && <Loader2 className="size-4 animate-spin" />}
                                    Supprimer définitivement
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
