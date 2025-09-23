"use client"

import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { FormItem } from '@/components/ui/form'
import { FormLabel } from '@/components/ui/form'
import { FormControl } from '@/components/ui/form'
import { FormDescription } from '@/components/ui/form'
import { FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { NewsletterFormSchema } from '@/features/NewsLetter/newsletter.schema'
import { useAction } from 'next-safe-action/hooks'
import React from 'react'
import { toast } from 'sonner'
import { EventsSchema } from '../events.schema'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { EventsSafeAction } from '../events.action'
import z from 'zod'

export default function FormCreateEvents() {
    const router = useRouter()
    // 1. Define your form.
    const form = useForm<z.infer<typeof EventsSchema>>({
        resolver: zodResolver(EventsSchema),
        defaultValues: {
            name: "",
            description: "",
            image: "",
            location: "",
            dateStart: new Date(),
            dateEnd: new Date(),
            openAt: new Date(),
            closeAt: new Date(),
            visibleToGuests: true,
            maxParticipants: 15,
        },
    })

    const { executeAsync, hasErrored, result, hasSucceeded } = useAction(EventsSafeAction, {
        onSuccess: (data) => {
            toast.success("Vous êtes inscrit à la newsletter");
            form.reset();
            router.refresh();
        },
        onError: (error) => {
            toast.error(error.error.serverError || "Une erreur est survenue");
        }
    });

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof EventsSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values);
        await executeAsync(values);
    }

    return (
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
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Description" {...field} />
                            </FormControl>
                            <FormDescription>
                                Votre description.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">S'inscrire à la newsletter</Button>
            </form>
        </Form>
    )
}
