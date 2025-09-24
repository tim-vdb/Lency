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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { DatePicker } from '@/components/ui/DatePicker'
import { DatePickerRange } from '@/components/ui/DatePickerRange'

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
            visibleToGuests: false,
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
        <div className='container h-screen flex justify-center items-center'>
            <Card>
                <CardHeader>
                    <CardTitle>Créer un événement</CardTitle>
                </CardHeader>
                <CardContent>
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
                                            Nom de l'événement.
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
                                            Description de l'événement.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="image"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Image</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Image" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Image de l'événement.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Lieu</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Lieu" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Lieu de l'événement.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="openAt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Ouverture inscription</FormLabel>
                                        <FormControl>
                                            <DatePicker
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Sélectionnez une date"
                                                label=""
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Date de début de l'événement.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="dateStart"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Fermeture inscription</FormLabel>
                                        <FormControl>
                                            <DatePickerRange setDateFrom={field.onChange} setDateTo={field.onChange} />
                                        </FormControl>
                                        <FormDescription>
                                            Date de fin de l'événement.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="visibleToGuests"
                                render={({ field }) => (
                                    <FormItem className='flex items-center gap-2'>
                                        <FormControl>
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel>Rendre public.</FormLabel>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <Button type="submit">Créer l'événement</Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
