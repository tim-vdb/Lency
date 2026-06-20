"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/front/components/ui/form";
import { Input } from "@/front/components/ui/input";
import { useChangePassword } from "@/front/queries/users";
import { ChangePasswordSchema, type ChangePasswordFormValues } from "@/front/schemas/zod/auth/change-password.zod";
import { useState } from "react";
import { cn } from "@/front/lib/utils";

export default function SecurityPassword() {
    const [showPassword, setShowPassword] = useState({ currentPassword: false, newPassword: false, confirmPassword: false });
    const togglePassword = (field: keyof typeof showPassword) =>
        setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));

    const { mutate: changePassword, isPending } = useChangePassword();

    const form = useForm<ChangePasswordFormValues>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
    });

    function onSubmit(values: ChangePasswordFormValues) {
        changePassword(
            {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            },
            {
                onSuccess: () => {
                    toast.success("Mot de passe mis à jour avec succès. Un email de confirmation vous a été envoyé.");
                    form.reset();
                },
                onError: (error) => {
                    const message = error instanceof Error ? error.message : "Une erreur est survenue";
                    if (message.toLowerCase().includes("incorrect") || message.toLowerCase().includes("actuel")) {
                        form.setError("currentPassword", { message: "Mot de passe actuel incorrect" });
                    } else {
                        toast.error(message);
                    }
                },
            }
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Mot de passe</CardTitle>
                <CardDescription>
                    Modifier votre mot de passe pour sécuriser votre compte.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Mot de passe actuel</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input type={showPassword.currentPassword ? "text" : "password"}                 placeholder="Entrer votre mot de passe actuel" {...field} />
                                        </FormControl>
                                        <Eye className={cn("size-5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground", showPassword.currentPassword ? "hidden" : "block")} onClick={() => togglePassword("currentPassword")} />
                                        <EyeOff className={cn("size-5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground", showPassword.currentPassword ? "block" : "hidden")} onClick={() => togglePassword("currentPassword")} />
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nouveau mot de passe</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input type={showPassword.newPassword ? "text" : "password"}                 placeholder="Entrer votre nouveau mot de passe" {...field} />
                                        </FormControl>
                                        <Eye className={cn("size-5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground", showPassword.newPassword ? "hidden" : "block")} onClick={() => togglePassword("newPassword")} />
                                        <EyeOff className={cn("size-5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground", showPassword.newPassword ? "block" : "hidden")} onClick={() => togglePassword("newPassword")} />
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirmer le mot de passe</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input type={showPassword.confirmPassword ? "text" : "password"} placeholder="Confirmer votre nouveau mot de passe" {...field} />
                                        </FormControl>
                                        <Eye className={cn("size-5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground", showPassword.confirmPassword ? "hidden" : "block")} onClick={() => togglePassword("confirmPassword")} />
                                        <EyeOff className={cn("size-5 absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground", showPassword.confirmPassword ? "block" : "hidden")} onClick={() => togglePassword("confirmPassword")} />
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isPending}>
                                {isPending && <Loader2 className="size-4 animate-spin" />}
                                Mettre à jour le mot de passe
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
