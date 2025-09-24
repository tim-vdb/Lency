"use client"

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { useRouter } from "next/navigation";
import { EventsFormSchema } from "@/features/SignUpEvents/events.schema";
import { EventsSafeAction } from "../events.action";
import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUpEvents() {
    const router = useRouter()
    // 1. Define your form.
    const form = useForm<z.infer<typeof EventsFormSchema>>({
        resolver: zodResolver(EventsFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            eventId: "", // on initialise eventId qui sera caché dans le formulaire
        },
    });

    const { executeAsync, hasErrored, result, hasSucceeded } = useAction(EventsSafeAction, {
        onSuccess: (data) => {
            toast.success("Vous êtes inscrit à l'event");
            form.reset();
            router.refresh();
        },
        onError: (error) => {
            toast.error(error.error.serverError || "Une erreur est survenue");
        }
    });

    // 2. Define a submit handler.
        async function onSubmit(values: z.infer<typeof EventsFormSchema>) {
            // Do something with the form values.
            // ✅ This will be type-safe and validated.
            // console.log(values);
            await executeAsync(values);
        }

    return (
        <div className="bg-blue-50 dark:bg-gray-800 py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                        Rejoindre un évènement
                    </h2>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nom" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Votre nom complet.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Votre email.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Phone" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Votre phone complet.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="eventId"
                                render={({ field }) => (
                                    <FormItem className="hidden"> {/* 👈 champ invisible */}
                                    <FormControl>
                                        <Input type="hidden" {...field} /> {/* 👈 on injecte l'id */}
                                    </FormControl>
                                    </FormItem>
                                )}
                                
                                />

                            <Button type="submit">S'inscrire à l'évènement</Button>
                        </form>
                    </Form>
                    {hasErrored && <p className="text-red-500">{result?.serverError}</p>}
                    {hasSucceeded && <p className="text-green-500">Vous êtes inscrit à la newsletter {result?.data?.name}</p>}
                </div>
            </div>
        </div>
    );
};