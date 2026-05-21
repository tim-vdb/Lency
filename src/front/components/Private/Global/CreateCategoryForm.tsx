"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Image as ImageIcon, Loader2, Upload, X } from "lucide-react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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
import { Textarea } from "@/front/components/ui/textarea"
import { useCreateCategory } from "@/front/hooks/queries/use-categories"
import { uploadToImageKit } from "@/front/lib/api/upload"

// ─── Schema ───────────────────────────────────────────────────────────────────

const CreateCategorySchema = z.object({
    name: z
        .string()
        .min(3, "Minimum 3 caractères")
        .max(50, "Maximum 50 caractères"),
    slug: z
        .string()
        .min(3, "Minimum 3 caractères")
        .max(50, "Maximum 50 caractères")
        .regex(/^[a-z0-9-]+$/, "Lettres minuscules, chiffres et tirets uniquement"),
    description: z
        .string()
        .max(500, "Maximum 500 caractères")
        .optional()
        .or(z.literal("")),
    rules: z
        .string()
        .max(1000, "Maximum 1000 caractères")
        .optional()
        .or(z.literal("")),
    iconUrl: z.string().optional(),
    bannerUrl: z.string().optional(),
})

type CreateCategoryValues = z.infer<typeof CreateCategorySchema>

// ─── Component ────────────────────────────────────────────────────────────────

interface CreateCategoryFormProps {
    onSuccess?: () => void
}

export function CreateCategoryForm({ onSuccess }: CreateCategoryFormProps) {
    const { mutate, isPending } = useCreateCategory()
    const [iconPreview, setIconPreview] = useState<string | null>(null)
    const [bannerPreview, setBannerPreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState<"icon" | "banner" | null>(null)
    const iconInputRef = useRef<HTMLInputElement>(null)
    const bannerInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<CreateCategoryValues>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
            rules: "",
            iconUrl: "",
            bannerUrl: "",
        },
    })

    // ── Helpers ───────────────────────────────────────────────────────────────

    function generateSlug(name: string) {
        return name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim()
    }

    async function handleImageUpload(file: File, type: "icon" | "banner") {
        setUploading(type)
        try {
            const url = await uploadToImageKit(file, "/categories")
            if (type === "icon") {
                form.setValue("iconUrl", url)
                setIconPreview(URL.createObjectURL(file))
            } else {
                form.setValue("bannerUrl", url)
                setBannerPreview(URL.createObjectURL(file))
            }
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erreur upload")
        } finally {
            setUploading(null)
        }
    }

    // ── Submit ────────────────────────────────────────────────────────────────

    function onSubmit(values: CreateCategoryValues) {
        mutate(
            {
                name: values.name,
                slug: values.slug,
                description: values.description || undefined,
                iconUrl: values.iconUrl || undefined,
                bannerUrl: values.bannerUrl || undefined,
                rules: values.rules || undefined,
            },
            {
                onSuccess: (cat) => {
                    toast.success(`Catégorie "${cat.name}" créée !`)
                    form.reset()
                    setIconPreview(null)
                    setBannerPreview(null)
                    onSuccess?.()
                },
                onError: (err) => toast.error(err.message),
            }
        )
    }

    const descriptionLength = form.watch("description")?.length ?? 0

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h2 className="text-lg font-semibold">Créer une catégorie</h2>
                <p className="text-sm text-muted-foreground">
                    Organisez le contenu par thématique.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    {/* ── Bannière ── */}
                    <div>
                        <FormLabel className="mb-1.5 block">Bannière (optionnel)</FormLabel>
                        {bannerPreview ? (
                            <div className="relative rounded-lg overflow-hidden">
                                <img
                                    src={bannerPreview}
                                    alt="banner"
                                    className="w-full h-24 object-cover"
                                />
                                <button
                                    type="button"
                                    onClick={() => { form.setValue("bannerUrl", ""); setBannerPreview(null) }}
                                    className="absolute top-2 right-2 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80 transition-colors"
                                >
                                    <X className="size-3.5" />
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                disabled={uploading === "banner"}
                                onClick={() => bannerInputRef.current?.click()}
                                className="w-full rounded-lg border-2 border-dashed border-border py-5 flex flex-col items-center gap-1 text-sm text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground transition-colors disabled:opacity-50"
                            >
                                {uploading === "banner"
                                    ? <Loader2 className="size-4 animate-spin" />
                                    : <Upload className="size-4" />
                                }
                                <span>Ajouter une bannière</span>
                                <span className="text-xs opacity-60">1200 × 300 px recommandé</span>
                            </button>
                        )}
                        <input
                            ref={bannerInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, "banner") }}
                        />
                    </div>

                    {/* ── Icône + Nom ── */}
                    <div className="flex gap-3 items-end">
                        {/* Icône */}
                        <div className="shrink-0">
                            <FormLabel className="mb-1.5 block text-xs">Icône</FormLabel>
                            {iconPreview ? (
                                <div className="relative w-14 h-14">
                                    <img
                                        src={iconPreview}
                                        alt="icon"
                                        className="w-14 h-14 rounded-lg object-cover"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => { form.setValue("iconUrl", ""); setIconPreview(null) }}
                                        className="absolute -top-1.5 -right-1.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80 transition-colors"
                                    >
                                        <X className="size-3" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    disabled={uploading === "icon"}
                                    onClick={() => iconInputRef.current?.click()}
                                    className="w-14 h-14 rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-muted-foreground/50 transition-colors disabled:opacity-50"
                                >
                                    {uploading === "icon"
                                        ? <Loader2 className="size-4 animate-spin" />
                                        : <ImageIcon className="size-4" />
                                    }
                                </button>
                            )}
                            <input
                                ref={iconInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f, "icon") }}
                            />
                        </div>

                        {/* Nom */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Nom</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="ex : Photographie, Design…"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                form.setValue("slug", generateSlug(e.target.value))
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* ── Slug ── */}
                    <FormField
                        control={form.control}
                        name="slug"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Slug (URL)</FormLabel>
                                <FormControl>
                                    <Input placeholder="ex : photographie" {...field} />
                                </FormControl>
                                <FormDescription className="text-xs">
                                    Généré automatiquement · lettres minuscules, chiffres et tirets
                                </FormDescription>
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
                                <div className="flex items-baseline justify-between">
                                    <FormLabel>Description (optionnel)</FormLabel>
                                    <span className="text-xs text-muted-foreground tabular-nums">
                                        {descriptionLength}/500
                                    </span>
                                </div>
                                <FormControl>
                                    <Textarea
                                        placeholder="Décrivez le thème et les discussions attendues…"
                                        className="min-h-20 resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Règles ── */}
                    <FormField
                        control={form.control}
                        name="rules"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Règles (optionnel)</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Règles de la catégorie…"
                                        className="min-h-16 resize-none text-sm"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Submit ── */}
                    <div className="flex justify-end gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => { form.reset(); setIconPreview(null); setBannerPreview(null) }}
                            disabled={isPending}
                        >
                            Réinitialiser
                        </Button>
                        <Button type="submit" disabled={isPending || uploading !== null}>
                            {isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Création…
                                </>
                            ) : "Créer la catégorie"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
