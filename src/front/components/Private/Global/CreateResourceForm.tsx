"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Music, Upload, Video, X } from "lucide-react"
import { useRef, useState } from "react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/front/components/ui/select"
import { Textarea } from "@/front/components/ui/textarea"
import { useCategories } from "@/front/hooks/queries/use-categories"
import { useCreateResource } from "@/front/hooks/queries/use-resources"

// ─── Schema ───────────────────────────────────────────────────────────────────

const baseSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(150, "Maximum 150 caractères"),
    description: z.string().max(500, "Maximum 500 caractères").optional().or(z.literal("")),
    type: z.enum(["ASSET", "TUTORIAL", "LINK"], { error: "Le type est requis" }),
    categoryId: z.string().min(1, "La catégorie est requise"),
    url: z.string().optional(),
    imageUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    audioUrl: z.string().optional(),
})

const CreateResourceSchema = baseSchema.superRefine((val, ctx) => {
    if (val.type === "LINK") {
        if (!val.url || !val.url.match(/^https?:\/\/.+/)) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "URL requise (https://…)", path: ["url"] })
        }
    } else {
        const hasMedia = val.imageUrl || val.videoUrl || val.audioUrl || (val.url && val.url.match(/^https?:\/\/.+/))
        if (!hasMedia) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Ajoute au moins un fichier ou une URL", path: ["imageUrl"] })
        }
    }
})

type CreateResourceValues = z.infer<typeof CreateResourceSchema>

const RESOURCE_TYPE_LABELS: Record<string, string> = {
    ASSET: "Asset",
    TUTORIAL: "Tutoriel",
    LINK: "Lien",
}

// ─── Upload helper ────────────────────────────────────────────────────────────

async function uploadFile(file: File): Promise<string> {
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Erreur upload")
    }
    const { url } = await res.json()
    return url
}

// ─── DropZone ─────────────────────────────────────────────────────────────────

function DropZone({
    accept,
    label,
    preview,
    uploading,
    onFile,
    onClear,
    icon: Icon,
}: {
    accept: string
    label: string
    preview: string | null
    uploading: boolean
    onFile: (f: File) => void
    onClear: () => void
    icon: React.ElementType
}) {
    const ref = useRef<HTMLInputElement>(null)
    return (
        <div>
            {preview ? (
                <div className="relative rounded-lg overflow-hidden bg-neutral-100">
                    {accept.startsWith("image") ? (
                        <img src={preview} alt="" className="w-full h-28 object-cover" />
                    ) : accept.startsWith("video") ? (
                        <video src={preview} className="w-full h-28 object-cover" />
                    ) : (
                        <div className="w-full h-16 flex items-center justify-center gap-2 text-sm text-neutral-600">
                            <Icon className="size-4" />{label}
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={onClear}
                        className="absolute top-2 right-2 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80 transition-colors"
                    >
                        <X className="size-3.5" />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    disabled={uploading}
                    onClick={() => ref.current?.click()}
                    className="w-full rounded-lg border-2 border-dashed border-border py-4 flex flex-col items-center gap-1 text-sm text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground transition-colors disabled:opacity-50"
                >
                    {uploading ? <Loader2 className="size-4 animate-spin" /> : <Icon className="size-4" />}
                    <span>{label}</span>
                </button>
            )}
            <input
                ref={ref}
                type="file"
                accept={accept}
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f) }}
            />
        </div>
    )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CreateResourceFormProps {
    onSuccess?: () => void
}

export function CreateResourceForm({ onSuccess }: CreateResourceFormProps) {
    const { mutate, isPending } = useCreateResource()
    const { data: categories } = useCategories()

    const [imagePrev, setImagePrev] = useState<string | null>(null)
    const [videoPrev, setVideoPrev] = useState<string | null>(null)
    const [audioPrev, setAudioPrev] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)

    const form = useForm<CreateResourceValues>({
        resolver: zodResolver(CreateResourceSchema),
        defaultValues: { title: "", description: "", type: undefined, url: "", imageUrl: "", videoUrl: "", audioUrl: "", categoryId: "" },
    })

    const type = form.watch("type")
    const isLink = type === "LINK"
    const isMediaType = type === "ASSET" || type === "TUTORIAL"
    const descriptionLength = form.watch("description")?.length ?? 0

    async function handleUpload(file: File, field: "imageUrl" | "videoUrl" | "audioUrl", setPreview: (v: string | null) => void) {
        setUploading(true)
        try {
            const url = await uploadFile(file)
            form.setValue(field, url)
            setPreview(URL.createObjectURL(file))
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erreur upload")
        } finally {
            setUploading(false)
        }
    }

    function clearField(field: "imageUrl" | "videoUrl" | "audioUrl", setPreview: (v: string | null) => void) {
        form.setValue(field, "")
        setPreview(null)
    }

    function onSubmit(values: CreateResourceValues) {
        mutate(
            {
                title: values.title,
                description: values.description || undefined,
                type: values.type,
                url: values.url || undefined,
                imageUrl: values.imageUrl || undefined,
                videoUrl: values.videoUrl || undefined,
                audioUrl: values.audioUrl || undefined,
                categoryId: values.categoryId,
            },
            {
                onSuccess: () => {
                    toast.success("Ressource créée !")
                    form.reset()
                    setImagePrev(null); setVideoPrev(null); setAudioPrev(null)
                    onSuccess?.()
                },
                onError: (err) => toast.error(err.message),
            }
        )
    }

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h2 className="text-lg font-semibold">Créer une ressource</h2>
                <p className="text-sm text-muted-foreground">Partagez un lien, un asset ou un tutoriel avec la communauté.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    {/* ── Type + Catégorie ── */}
                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.entries(RESOURCE_TYPE_LABELS).map(([v, l]) => (
                                                <SelectItem key={v} value={v}>{l}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Catégorie</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value ?? ""}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Choisir…" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories?.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* ── Titre ── */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Titre</FormLabel>
                                <FormControl><Input placeholder="Nom de la ressource…" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── LINK → URL seule ── */}
                    {isLink && (
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL</FormLabel>
                                    <FormControl><Input type="url" placeholder="https://…" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {/* ── ASSET / TUTORIAL → fichiers + URL optionnelle ── */}
                    {isMediaType && (
                        <div className="flex flex-col gap-3">
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Image <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></FormLabel>
                                        <DropZone
                                            accept="image/*"
                                            label="Ajouter une image"
                                            preview={imagePrev}
                                            uploading={uploading}
                                            onFile={(f) => handleUpload(f, "imageUrl", setImagePrev)}
                                            onClear={() => clearField("imageUrl", setImagePrev)}
                                            icon={Upload}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="videoUrl"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Vidéo <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></FormLabel>
                                        <DropZone
                                            accept="video/*"
                                            label="Ajouter une vidéo"
                                            preview={videoPrev}
                                            uploading={uploading}
                                            onFile={(f) => handleUpload(f, "videoUrl", setVideoPrev)}
                                            onClear={() => clearField("videoUrl", setVideoPrev)}
                                            icon={Video}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="audioUrl"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Audio <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></FormLabel>
                                        <DropZone
                                            accept="audio/*"
                                            label="Ajouter un audio"
                                            preview={audioPrev}
                                            uploading={uploading}
                                            onFile={(f) => handleUpload(f, "audioUrl", setAudioPrev)}
                                            onClear={() => clearField("audioUrl", setAudioPrev)}
                                            icon={Music}
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>URL externe <span className="text-muted-foreground font-normal text-xs">(optionnel)</span></FormLabel>
                                        <FormControl><Input type="url" placeholder="https://…" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    )}

                    {/* ── Description ── */}
                    {type && (
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
                                        <Textarea placeholder="Décrivez cette ressource…" className="min-h-20 resize-none" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {/* ── Submit ── */}
                    <div className="flex justify-end gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => { form.reset(); setImagePrev(null); setVideoPrev(null); setAudioPrev(null) }}
                            disabled={isPending}
                        >
                            Réinitialiser
                        </Button>
                        <Button type="submit" disabled={isPending || uploading || !type}>
                            {isPending ? <><Loader2 className="size-4 animate-spin" />Création…</> : "Créer la ressource"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
