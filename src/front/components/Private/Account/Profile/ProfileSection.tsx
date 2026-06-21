"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Camera, Loader2, Mail } from "lucide-react"
import dayjs from "dayjs"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { useRef, useState } from "react"
import { uploadToImageKit } from "@/front/lib/upload"
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar"
import { Button } from "@/front/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/front/components/ui/form"
import { Input } from "@/front/components/ui/input"
import { Separator } from "@/front/components/ui/separator"
import { useUser } from "@/front/states/contexts/user.context"
import { useUpdateUser } from "@/front/queries/users"
import { UpdateProfileSchema, type UpdateProfileFormValues } from "@/front/schemas/zod/profile.zod"
import { getInitialName } from "@/front/lib/utils"
import { VerifyEmailChangeModal } from "./VerifyEmailChangeModal"
import { useRouter } from "next/navigation"
import type { Account } from "@/back/generated/prisma_client"

export function ProfileSection() {
    const user = useUser() as any
    const router = useRouter()
    const { mutate: updateUser, isPending } = useUpdateUser()
    const [showEmailModal, setShowEmailModal] = useState(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const avatarInputRef = useRef<HTMLInputElement>(null)

    const hasCredentialAccount = (user?.accounts as Account[] | undefined ?? []).some(
        (account: Account) => account.providerId === 'credential' && account.password
    )

    async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        e.target.value = ""
        if (!file) return

        if (!file.type.startsWith("image/")) {
            toast.error("Seules les images sont acceptées.")
            return
        }
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Fichier trop volumineux (max 2 Mo).")
            return
        }

        setIsUploadingAvatar(true)
        try {
            const url = await uploadToImageKit(file, "/avatars")
            updateUser(
                { id: user!.id, data: { image: url } },
                {
                    onSuccess: () => toast.success("Photo de profil mise à jour."),
                    onError: (err) => toast.error(err instanceof Error ? err.message : "Échec de la mise à jour"),
                }
            )
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Échec de l'upload")
        } finally {
            setIsUploadingAvatar(false)
        }
    }

    const form = useForm<UpdateProfileFormValues>({
        resolver: zodResolver(UpdateProfileSchema),
        defaultValues: {
            firstname: user?.firstname ?? "",
            lastname: user?.lastname ?? "",
            username: user?.username ?? "",
        },
    })

    function onSubmit(values: UpdateProfileFormValues) {
        if (!user?.id) return

        updateUser(
            { id: user.id, data: values },
            {
                onSuccess: () => {
                    toast.success("Profil mis à jour avec succès.")
                    router.refresh()
                },
                onError: (error) => {
                    toast.error(error instanceof Error ? error.message : "Une erreur est survenue")
                },
            }
        )
    }

    const initials = user ? getInitialName(user) : "?"

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Informations du profil</CardTitle>
                    <CardDescription>
                        Mettez à jour vos informations personnelles et votre photo de profil.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-4">
                            <Avatar className="size-20">
                                <AvatarImage src={(user?.avatarUrl || user?.image) ?? ""} alt="Photo de profil" />
                                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col gap-2">
                                <input
                                    ref={avatarInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarChange}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    type="button"
                                    onClick={() => avatarInputRef.current?.click()}
                                    disabled={isUploadingAvatar}
                                >
                                    {isUploadingAvatar ? (
                                        <Loader2 className="size-4 animate-spin" />
                                    ) : (
                                        <Camera className="size-4" />
                                    )}
                                    {isUploadingAvatar ? "Envoi..." : "Changer la photo"}
                                </Button>
                                <p className="text-xs text-muted-foreground">JPG, PNG ou GIF. Max 2 Mo.</p>
                            </div>
                        </div>

                        <Separator />

                        {/* Form */}
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="firstname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Prénom</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Non spécifié" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="lastname"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Nom</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Non spécifié" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nom d'utilisateur</FormLabel>
                                            <FormControl>
                                                <Input placeholder="@username" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="space-y-2">
                                    <FormLabel>Email</FormLabel>
                                    <div className="flex gap-2">
                                        <div className="flex-1 rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                                            {user?.email}
                                        </div>
                                        {hasCredentialAccount && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setShowEmailModal(true)}
                                            >
                                                <Mail className="size-4" />
                                                Changer
                                            </Button>
                                        )}
                                        {!hasCredentialAccount && (
                                            <div className="text-xs text-muted-foreground py-2 px-3">
                                                Connecté via OAuth
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                {/* Account Info */}
                                <div className="grid gap-4 sm:grid-cols-3 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Rôle</p>
                                        <p className="font-medium">
                                            {user?.role === "ADMIN" ? "Admin" : "Membre"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Inscription</p>
                                        <p className="font-medium">
                                            {user?.createdAt
                                                ? dayjs(user.createdAt).format("DD/MM/YYYY")
                                                : "—"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Dernière modification</p>
                                        <p className="font-medium">
                                            {user?.updatedAt
                                                ? dayjs(user.updatedAt).format("DD/MM/YYYY")
                                                : "—"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isPending}>
                                        {isPending && <Loader2 className="size-4 animate-spin" />}
                                        Enregistrer les modifications
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>

            {/* Email Change Modal */}
            <VerifyEmailChangeModal
                open={showEmailModal}
                onOpenChange={setShowEmailModal}
                currentEmail={user?.email ?? ""}
            />
        </div>
    )
}
