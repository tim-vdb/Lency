"use client"

import { Button } from '@/components/ui/button'
import { Form, FormField } from '@/components/ui/form'
import { FormItem } from '@/components/ui/form'
import { FormLabel } from '@/components/ui/form'
import { FormControl } from '@/components/ui/form'
import { FormDescription } from '@/components/ui/form'
import { FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { NewsletterFormSchema } from '@/features/NewsLetter/server/newsletter.schema'
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
import { UploadButton } from '@/lib/uploadthing'

export default function FormCreateEvents() {
    const router = useRouter()
    // 1. Define your form.
    const form = useForm<z.infer<typeof EventsSchema>>({
        resolver: zodResolver(EventsSchema) as any,
        defaultValues: {
            name: "",
            description: "",
            location: "",
            dateStart: new Date(),
            dateEnd: new Date(),
            openAt: new Date(),
            closeAt: new Date(),
            visibleToGuests: false,
            maxParticipants: 15,
        },
    })

    // Fonction pour gérer les changements de date range
    const handleDateRangeChange = (dateStart: Date | undefined, dateEnd: Date | undefined) => {
        if (dateStart && dateEnd) {
            form.setValue('dateStart', dateStart)
            form.setValue('dateEnd', dateEnd)
        }
    }

    const { executeAsync, hasErrored, result, hasSucceeded } = useAction(EventsSafeAction, {
        onSuccess: (data) => {
            toast.success("Événement créé avec succès !");
            form.reset();
            // Forcer le rafraîchissement de la page
            window.location.reload();
        },
        onError: (error) => {
            console.error('Erreur lors de la création de l\'événement:', error);
            toast.error(error.error.serverError || "Une erreur est survenue lors de la création de l'événement");
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
        <div className='container flex justify-center items-center'>
            <Card>
                <CardHeader>
                    <CardTitle>Créer un événement</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <div className='flex items-center flex-col md:flex-row gap-4'>

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
                            </div>
                            <UploadButton
                                endpoint="EventUploader"
                                onClientUploadComplete={(res) => {
                                    console.log("Files: ", res);
                                }}
                                onUploadError={(error: Error) => {
                                    alert(`ERROR! ${error.message}`);
                                }}
                                className="mb-4 bg-blue-600 ut-allowed-content:text-white text-white px-4 py-2 rounded-lg transition-colors [&_label]:w-full [&_label]:hover:bg-blue-500 "
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
                            <div className='flex items-center flex-col md:flex-row gap-4'>

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
                                                Date d'ouverture des inscriptions.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="closeAt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Fermeture inscription</FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    placeholder="Sélectionnez une date"
                                                    label=""
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Date de fermeture des inscriptions.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="dateStart"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Durée de l'événement</FormLabel>
                                        <FormControl>
                                            <DatePickerRange
                                                dateStart={form.getValues('dateStart')}
                                                dateEnd={form.getValues('dateEnd')}
                                                onChange={handleDateRangeChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="maxParticipants"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max participants</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Max participants" type="number" {...field} />
                                        </FormControl>
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
