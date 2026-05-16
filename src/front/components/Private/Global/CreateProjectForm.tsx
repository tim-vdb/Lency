"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, MapPin, Search } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/front/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/front/components/ui/form"
import { Input } from "@/front/components/ui/input"
import { Textarea } from "@/front/components/ui/textarea"
import { useCreateProject } from "@/front/hooks/queries/use-projects"
import { cn } from "@/front/lib/utils"

// ─── Schema ───────────────────────────────────────────────────────────────────

const CreateProjectSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    description: z.string().min(1, "La description est requise"),
    mapLocation: z
        .object({
            name: z.string().min(1, "Le nom du lieu est requis"),
            latitude: z.number(),
            longitude: z.number(),
            description: z.string().optional(),
        })
        .optional(),
})

type CreateProjectValues = z.infer<typeof CreateProjectSchema>

// ─── Geocoding (Nominatim / OpenStreetMap) ────────────────────────────────────

async function geocodeAddress(address: string): Promise<{ lat: number; lon: number; display_name: string } | null> {
    const params = new URLSearchParams({
        q: address,
        format: "json",
        limit: "1",
    })
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
        headers: { "Accept-Language": "fr" },
    })
    if (!res.ok) return null
    const data = await res.json()
    if (!data.length) return null
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon), display_name: data[0].display_name }
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CreateProjectFormProps {
    onSuccess: () => void
}

export function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
    const { mutate, isPending } = useCreateProject()
    const [withLocation, setWithLocation] = useState(false)
    const [addressInput, setAddressInput] = useState("")
    const [geocoding, setGeocoding] = useState(false)
    const [resolvedAddress, setResolvedAddress] = useState<string | null>(null)

    const form = useForm<CreateProjectValues>({
        resolver: zodResolver(CreateProjectSchema),
        defaultValues: {
            title: "",
            description: "",
            mapLocation: undefined,
        },
    })

    function toggleLocation(enabled: boolean) {
        setWithLocation(enabled)
        if (!enabled) {
            form.setValue("mapLocation", undefined)
            form.clearErrors("mapLocation")
            setAddressInput("")
            setResolvedAddress(null)
        }
    }

    async function handleGeocode() {
        if (!addressInput.trim()) return
        setGeocoding(true)
        try {
            const result = await geocodeAddress(addressInput)
            if (!result) {
                toast.error("Adresse introuvable, essayez d'être plus précis.")
                return
            }
            form.setValue("mapLocation", {
                name: addressInput,
                latitude: result.lat,
                longitude: result.lon,
                description: "",
            })
            form.clearErrors("mapLocation")
            setResolvedAddress(result.display_name)
        } catch {
            toast.error("Erreur lors de la recherche d'adresse.")
        } finally {
            setGeocoding(false)
        }
    }

    function onSubmit(values: CreateProjectValues) {
        mutate(
            { ...values, mapLocation: withLocation ? values.mapLocation : undefined },
            {
                onSuccess: () => {
                    toast.success("Projet créé !")
                    onSuccess()
                },
                onError: (err) => toast.error(err.message),
            }
        )
    }

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h2 className="text-lg font-semibold">Créer un projet</h2>
                <p className="text-sm text-muted-foreground">
                    Présentez votre projet à la communauté.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    {/* ── Titre ── */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Titre</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nom de votre projet…" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Description ── */}
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

                    {/* ── Toggle localisation ── */}
                    <button
                        type="button"
                        onClick={() => toggleLocation(!withLocation)}
                        className={cn(
                            "flex items-center gap-2 self-start rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                            withLocation
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                        )}
                    >
                        <MapPin className="size-3.5" />
                        {withLocation ? "Localisation ajoutée" : "Ajouter une localisation"}
                    </button>

                    {/* ── Champs localisation ── */}
                    {withLocation && (
                        <div className="flex flex-col gap-3 rounded-lg border p-4">

                            {/* Recherche d'adresse */}
                            <div className="flex flex-col gap-1.5">
                                <FormLabel>Adresse</FormLabel>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Ex : 10 rue de Rivoli, Paris…"
                                        value={addressInput}
                                        onChange={(e) => {
                                            setAddressInput(e.target.value)
                                            setResolvedAddress(null)
                                            form.setValue("mapLocation", undefined)
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                                e.preventDefault()
                                                handleGeocode()
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        disabled={geocoding || !addressInput.trim()}
                                        onClick={handleGeocode}
                                        className="shrink-0"
                                    >
                                        {geocoding
                                            ? <Loader2 className="size-4 animate-spin" />
                                            : <Search className="size-4" />
                                        }
                                    </Button>
                                </div>

                                {/* Adresse résolue */}
                                {resolvedAddress && (
                                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                        <MapPin className="size-3 shrink-0 text-primary" />
                                        {resolvedAddress}
                                    </p>
                                )}

                                {/* Erreur si on soumet sans avoir résolu */}
                                <FormField
                                    control={form.control}
                                    name="mapLocation"
                                    render={() => <FormMessage />}
                                />
                            </div>

                            {/* Description du lieu (optionnel) */}
                            <FormField
                                control={form.control}
                                name="mapLocation.description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Description du lieu{" "}
                                            <span className="text-muted-foreground font-normal">(optionnel)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Précisions sur le lieu…" {...field} value={field.value ?? ""} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    {/* ── Submit ── */}
                    <div className="flex justify-end pt-1">
                        <Button type="submit" disabled={isPending || geocoding}>
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
