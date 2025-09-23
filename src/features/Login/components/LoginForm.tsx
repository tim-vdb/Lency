"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginFormSchema } from "../../Login/login.schema";
import { signIn } from "@/lib/auth-client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
    const router = useRouter()
    // 1. Define your form.
    const form = useForm<z.infer<typeof LoginFormSchema>>({
        resolver: zodResolver(LoginFormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values);
        await signIn.email({
            email: values.email,
            password: values.password,
        }, {
            onSuccess: () => {
                toast.success("Utilisateur Connecté");
                router.push("/dashboard");
                router.refresh();
            },
            onError: (ctx) => {
                toast.error(ctx.error.serverError || "Une erreur est survenue");
            }
        })
    }

    return (
        <div className="bg-blue-50 dark:bg-gray-800 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Connectez-vous à Mölkky !
                    </h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de Passe</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Se connecter</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    );
};