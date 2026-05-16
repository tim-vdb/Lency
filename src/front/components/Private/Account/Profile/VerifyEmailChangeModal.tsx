"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "@/front/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/front/components/ui/form"
import { Input } from "@/front/components/ui/input"
import { useVerifyEmailChange } from "@/front/hooks/queries/use-users"
import { VerifyEmailChangeSchema, type VerifyEmailChangeValues } from "@/front/types/email-change.schema"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/front/components/ui/dialog"

interface VerifyEmailChangeModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    currentEmail: string
}

export function VerifyEmailChangeModal({ open, onOpenChange, currentEmail }: VerifyEmailChangeModalProps) {
    const { mutate: verifyEmailChange, isPending } = useVerifyEmailChange()

    const form = useForm<VerifyEmailChangeValues>({
        resolver: zodResolver(VerifyEmailChangeSchema),
        defaultValues: {
            currentPassword: "",
            newEmail: "",
        },
    })

    function onSubmit(values: VerifyEmailChangeValues) {
        verifyEmailChange(values, {
            onSuccess: () => {
                toast.success("Un email de confirmation a été envoyé à votre nouvelle adresse.")
                form.reset()
                onOpenChange(false)
            },
            onError: (error) => {
                const message = error instanceof Error ? error.message : "Une erreur est survenue"
                if (message.toLowerCase().includes("incorrect") || message.toLowerCase().includes("password")) {
                    form.setError("currentPassword", { message: "Mot de passe incorrect" })
                } else {
                    toast.error(message)
                }
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Changer d'adresse email</DialogTitle>
                    <DialogDescription>
                        Entrez votre mot de passe et votre nouvelle adresse email.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Current Email - Read Only */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Email actuel</label>
                        <div className="rounded-md border border-input bg-muted/50 px-3 py-2 text-sm text-muted-foreground">
                            {currentEmail}
                        </div>
                    </div>

                    {/* Form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe actuel</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="newEmail"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nouvelle adresse email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="nouveau@email.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-2 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={isPending}
                                >
                                    Annuler
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending && <Loader2 className="size-4 animate-spin" />}
                                    Continuer
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
