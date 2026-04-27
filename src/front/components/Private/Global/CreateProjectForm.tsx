"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, MapPin, X } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/front/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/front/components/ui/form"
import { Input } from "@/front/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/front/components/ui/select"
import { Switch } from "@/front/components/ui/switch"
import { Textarea } from "@/front/components/ui/textarea"
import { useCreateProject } from "@/front/hooks/querys/use-projects"
import { CreateProjectFormValues, CreateProjectSchema } from "@/front/types/project.schema"

// ─── Component ────────────────────────────────────────────────────────────────

interface CreateProjectFormProps {
    onSuccess: () => void
}

export function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
    const { mutate, isPending } = useCreateProject()
    const [showMapLocation, setShowMapLocation] = useState(false)

    const form = useForm<CreateProjectFormValues>({
        resolver: zodResolver(CreateProjectSchema),
        defaultValues: {
            title: "",
            description: "",
            mapLocation: undefined,
        },
    })

    function onSubmit(values: CreateProjectFormValues) {
        mutate(values, {
            onSuccess: () => {
                toast.success("Projet créé avec succès !")
                onSuccess()
            },
            onError: (err) => {
                toast.error(err.message)
            },
        })
    }

    function handleToggleMapLocation(enabled: boolean) {
        setShowMapLocation(enabled)
        if (!enabled) {
            form.setValue("mapLocation", undefined)
        } else {
            form.setValue("mapLocation", {
                name: "",
                latitude: 0,
                longitude: 0,
                description: "",
            })
        }
    }

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h2 className="text-lg font-semibold">Créer un projet</h2>
                <p className="text-sm text-muted-foreground">
                    Décrivez votre projet et invitez la communauté à y participer.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    {/* Titre */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Titre</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Donnez un titre à votre projet…"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Décrivez votre projet…"
                                        className="min-h-28 resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Toggle localisation */}
                    <div className="flex items-center justify-between rounded-lg border px-4 py-3">
                        <div className="flex items-center gap-2">
                            <MapPin className="size-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">Ajouter une localisation</p>
                                <p className="text-xs text-muted-foreground">
                                    Associez une adresse ou un lieu à ce projet
                                </p>
                            </div>
                        </div>
                        <Switch
                            checked={showMapLocation}
                            onCheckedChange={handleToggleMapLocation}
                        />
                    </div>

                    {/* Champs localisation */}
                    {showMapLocation && (
                        <div className="flex flex-col gap-3 rounded-lg border p-4">
                            <p className="text-sm font-medium">Localisation</p>

                            <FormField
                                control={form.control}
                                name="mapLocation.name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom du lieu</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Ex : Parc de la Tête d'Or" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <FormField
                                    control={form.control}
                                    name="mapLocation.latitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Latitude</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    placeholder="45.7676"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="mapLocation.longitude"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Longitude</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="any"
                                                    placeholder="4.8340"
                                                    {...field}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="mapLocation.description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description du lieu <span className="text-muted-foreground">(optionnel)</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Précisez l'endroit…" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    <div className="flex justify-end pt-1">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Création…
                                </>
                            ) : (
                                "Créer le projet"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
