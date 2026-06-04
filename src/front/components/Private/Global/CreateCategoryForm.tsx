"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Upload, X } from "lucide-react"
import { useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

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
import { MultistepForm, MultistepStep, MultistepNavigation } from "@/front/components/ui/multistep-form"
import { useCreateCategory } from "@/front/hooks/queries/use-categories"
import { uploadToImageKit } from "@/front/lib/upload"

// ─── Schema ───────────────────────────────────────────────────────────────────

const CreateCategorySchema = z.object({
    name: z.string().min(3, "Minimum 3 caractères").max(50, "Maximum 50 caractères"),
    slug: z
        .string()
        .min(3, "Minimum 3 caractères")
        .max(50, "Maximum 50 caractères")
        .regex(/^[a-z0-9-]+$/, "Lettres minuscules, chiffres et tirets uniquement"),
    description: z.string().max(500, "Maximum 500 caractères").optional().or(z.literal("")),
    rules: z.string().max(1000, "Maximum 1000 caractères").optional().or(z.literal("")),
    iconUrl: z.string().optional(),
    bannerUrl: z.string().optional(),
})

type CreateCategoryValues = z.infer<typeof CreateCategorySchema>

const STEPS = [
    { id: "identite", title: "Identité" },
    { id: "description", title: "Description" },
]

// ─── Component ────────────────────────────────────────────────────────────────

interface CreateCategoryFormProps {
    onSuccess?: () => void
}

export function CreateCategoryForm({ onSuccess }: CreateCategoryFormProps) {
    const { mutate, isPending } = useCreateCategory()
    const [bannerPreview, setBannerPreview] = useState<string | null>(null)
    const [uploading, setUploading] = useState<"icon" | "banner" | null>(null)
    const bannerInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<CreateCategoryValues>({
        resolver: zodResolver(CreateCategorySchema),
        defaultValues: { name: "", slug: "", description: "", rules: "", iconUrl: "", bannerUrl: "" },
    })

    const descriptionLength = form.watch("description")?.length ?? 0

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

    async function handleImageUpload(file: File, type: "banner") {
        setUploading(type)
        try {
            const url = await uploadToImageKit(file, "/categories")
            form.setValue("bannerUrl", url)
            setBannerPreview(URL.createObjectURL(file))

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
                    setBannerPreview(null)
                    onSuccess?.()
                },
                onError: (err) => toast.error(err.message),
            }
        )
    }

    return (
        <Form {...form}>
            <MultistepForm
                steps={STEPS}
                onFormSubmit={form.handleSubmit(onSubmit)}
                navigation={
                    <MultistepNavigation
                        onNext={async (step) => {
                            if (step === 0) return form.trigger(["name", "slug"])
                            return true
                        }}
                        isPending={isPending}
                        disabled={uploading !== null}
                        submitLabel="Créer la catégorie"
                    />
                }
            >
                {/* ── Étape 1 : Identité ── */}
                <MultistepStep title="Identité" description="Bannière, nom et URL de la catégorie.">
                    {/* Bannière */}
                    <div>
                        <FormLabel className="mb-1.5 block">Bannière <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></FormLabel>
                        {bannerPreview ? (
                            <div className="relative rounded-lg overflow-hidden">
                                <img src={bannerPreview} alt="banner" className="w-full h-24 object-cover" />
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
                                {uploading === "banner" ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
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

                    {/* Icône + Nom */}
                    <div className="flex gap-3 items-end">

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
                </MultistepStep>

                {/* ── Étape 2 : Description ── */}
                <MultistepStep title="Description & règles" description="Tous les champs sont optionnels.">
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-baseline justify-between">
                                    <FormLabel>Description <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></FormLabel>
                                    <span className="text-xs text-muted-foreground tabular-nums">{descriptionLength}/500</span>
                                </div>
                                <FormControl>
                                    <Textarea
                                        placeholder="Décrivez le thème et les discussions attendues…"
                                        className="min-h-24 resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="rules"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Règles <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Règles de la catégorie…"
                                        className="min-h-20 resize-none text-sm"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </MultistepStep>
            </MultistepForm>
        </Form>
    )
}
