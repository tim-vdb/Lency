"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import {
    FileText,
    Image as ImageIcon,
    Loader2,
    Monitor,
    Music,
    Smartphone,
    UploadCloud,
    Video,
    X,
} from "lucide-react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/front/components/ui/select"
import { Switch } from "@/front/components/ui/switch"
import { Textarea } from "@/front/components/ui/textarea"
import { useCategories } from "@/front/hooks/queries/use-categories"
import { useCreatePost } from "@/front/hooks/queries/use-posts"
import { cn } from "@/front/lib/utils"
import { uploadToImageKit } from "@/front/lib/upload"

// ─── Types ────────────────────────────────────────────────────────────────────

const CONTENT_TYPES = ["TEXT", "IMAGE", "VIDEO", "AUDIO"] as const
type ContentType = (typeof CONTENT_TYPES)[number]

type PostOrientation = "LANDSCAPE" | "PORTRAIT"

type ContentConfig = {
    label: string
    icon: React.ElementType
    accept: string
    mediaKey: "imageUrl" | "videoUrl" | "audioUrl" | null
    hint: string
    hasOrientation: boolean
}

const CONTENT_CONFIG: Record<ContentType, ContentConfig> = {
    TEXT:  { label: "Texte",  icon: FileText,  accept: "",        mediaKey: null,       hint: "",              hasOrientation: false },
    IMAGE: { label: "Image",  icon: ImageIcon, accept: "image/*", mediaKey: "imageUrl", hint: "JPG, PNG, WebP, GIF", hasOrientation: true },
    VIDEO: { label: "Vidéo",  icon: Video,     accept: "video/*", mediaKey: "videoUrl", hint: "MP4, WebM",     hasOrientation: true },
    AUDIO: { label: "Audio",  icon: Music,     accept: "audio/*", mediaKey: "audioUrl", hint: "MP3, WAV, OGG", hasOrientation: false },
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const ALL_FORMATS = ["TEXT", "IMAGE", "VIDEO", "AUDIO"] as const
const ALL_ORIENTATIONS = ["LANDSCAPE", "PORTRAIT"] as const

const CreatePostSchema = z.object({
    content:     z.string().min(1, "Le contenu est requis"),
    categoryId:  z.string().min(1, "Choisissez une catégorie"),
    format:      z.enum(ALL_FORMATS),
    orientation: z.enum(ALL_ORIENTATIONS).optional(),
    isPublished: z.boolean(),
    imageUrl:    z.string().optional(),
    videoUrl:    z.string().optional(),
    audioUrl:    z.string().optional(),
})

type CreatePostValues = z.infer<typeof CreatePostSchema>

// ─── Component ────────────────────────────────────────────────────────────────

interface CreatePostFormProps {
    onSuccess: () => void
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
    const { mutate, isPending } = useCreatePost()
    const { data: categories, isLoading: categoriesLoading } = useCategories()

    const [contentType, setContentType] = useState<ContentType>("TEXT")
    const [isMobile, setIsMobile]       = useState(false)
    const [uploading, setUploading]     = useState(false)
    const [mediaPreview, setMediaPreview] = useState<string | null>(null)
    const [mediaName, setMediaName]       = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const config = CONTENT_CONFIG[contentType]

    const form = useForm<CreatePostValues>({
        resolver: zodResolver(CreatePostSchema),
        defaultValues: {
            content: "",
            categoryId: "",
            format: "TEXT" as const,
            orientation: undefined,
            isPublished: false,
        },
    })

    // ── Media upload ──────────────────────────────────────────────────────────

    async function handleFileUpload(file: File) {
        setUploading(true)
        try {
            const url = await uploadToImageKit(file, "/posts")
            form.setValue(config.mediaKey!, url)
            setMediaName(file.name)
            if (contentType === "IMAGE") setMediaPreview(URL.createObjectURL(file))
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erreur upload")
        } finally {
            setUploading(false)
        }
    }

    function clearMedia() {
        if (!config.mediaKey) return
        form.setValue(config.mediaKey, undefined)
        setMediaPreview(null)
        setMediaName(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    function switchContentType(type: ContentType) {
        clearMedia()
        setContentType(type)
        setIsMobile(false)
        form.setValue("format", type)
        form.setValue("orientation", CONTENT_CONFIG[type].hasOrientation ? "LANDSCAPE" : undefined)
    }

    function toggleOrientation(mobile: boolean) {
        setIsMobile(mobile)
        form.setValue("orientation", mobile ? "PORTRAIT" : "LANDSCAPE")
    }

    // ── Submit ────────────────────────────────────────────────────────────────

    function onSubmit(values: CreatePostValues) {
        mutate(values, {
            onSuccess: () => {
                toast.success(
                    values.isPublished ? "Post publié !" : "Post sauvegardé en brouillon."
                )
                onSuccess()
            },
            onError: (err) => toast.error(err.message),
        })
    }

    const isPublished = form.watch("isPublished")

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h2 className="text-lg font-semibold">Créer un post</h2>
                <p className="text-sm text-muted-foreground">
                    Partagez votre contenu avec la communauté.
                </p>
            </div>

            {/* ── Sélecteur de type de contenu ── */}
            <div className="grid grid-cols-4 gap-2">
                {CONTENT_TYPES.map((type) => {
                    const { label, icon: Icon } = CONTENT_CONFIG[type]
                    const active = contentType === type
                    return (
                        <button
                            key={type}
                            type="button"
                            onClick={() => switchContentType(type)}
                            className={cn(
                                "flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-xs font-medium transition-all",
                                active
                                    ? "border-primary bg-primary/5 text-primary"
                                    : "border-border text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground"
                            )}
                        >
                            <Icon className="size-4" />
                            {label}
                        </button>
                    )
                })}
            </div>

            {/* ── Orientation (IMAGE / VIDEO uniquement) ── */}
            {config.hasOrientation && (
                <div className="flex items-center gap-1 rounded-lg border p-1 w-fit self-start">
                    <button
                        type="button"
                        onClick={() => toggleOrientation(false)}
                        className={cn(
                            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                            !isMobile
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Monitor className="size-3.5" />
                        Paysage
                    </button>
                    <button
                        type="button"
                        onClick={() => toggleOrientation(true)}
                        className={cn(
                            "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                            isMobile
                                ? "bg-background shadow-sm text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Smartphone className="size-3.5" />
                        Portrait
                    </button>
                </div>
            )}

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

                    {/* ── Zone upload media (masqué pour TEXT) ── */}
                    {contentType !== "TEXT" && (
                        <div>
                            <FormLabel className="mb-1.5 block">
                                {contentType === "IMAGE" ? "Image" : contentType === "VIDEO" ? "Vidéo" : "Fichier audio"}
                            </FormLabel>

                            {mediaName ? (
                                <div className={cn(
                                    "relative rounded-lg border overflow-hidden",
                                    isMobile && contentType === "IMAGE" ? "max-w-48" : "w-full"
                                )}>
                                    {contentType === "IMAGE" && mediaPreview && (
                                        <img
                                            src={mediaPreview}
                                            alt="preview"
                                            className={cn(
                                                "w-full object-cover",
                                                isMobile ? "aspect-9/16" : "h-40"
                                            )}
                                        />
                                    )}
                                    {contentType !== "IMAGE" && (
                                        <div className="flex items-center gap-2 px-4 py-3 bg-muted/30">
                                            {contentType === "VIDEO"
                                                ? <Video className="size-4 shrink-0 text-muted-foreground" />
                                                : <Music className="size-4 shrink-0 text-muted-foreground" />
                                            }
                                            <span className="text-sm truncate text-foreground">{mediaName}</span>
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        onClick={clearMedia}
                                        className="absolute top-2 right-2 rounded-full bg-black/60 p-0.5 text-white hover:bg-black/80 transition-colors"
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    disabled={uploading}
                                    onClick={() => fileInputRef.current?.click()}
                                    className={cn(
                                        "rounded-lg border-2 border-dashed border-border text-center text-sm text-muted-foreground hover:border-muted-foreground/50 hover:text-foreground transition-colors disabled:opacity-50",
                                        isMobile ? "w-40 aspect-9/16 flex flex-col items-center justify-center gap-1.5" : "w-full px-4 py-8"
                                    )}
                                >
                                    {uploading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <Loader2 className="size-4 animate-spin" />
                                            Upload…
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-1.5">
                                            <UploadCloud className="size-5" />
                                            <span className="text-xs">Cliquez pour ajouter</span>
                                            <span className="text-[10px] opacity-60">{config.hint}</span>
                                        </div>
                                    )}
                                </button>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={config.accept}
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleFileUpload(file)
                                }}
                            />
                        </div>
                    )}

                    {/* ── Contenu / Description ── */}
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {contentType === "TEXT" ? "Contenu" : "Description (optionnel)"}
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={
                                            contentType === "TEXT"
                                                ? "Écrivez votre contenu…"
                                                : "Ajoutez une description…"
                                        }
                                        className={cn(
                                            "resize-none",
                                            contentType === "TEXT" ? "min-h-28" : "min-h-16"
                                        )}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Catégorie + Publish ── */}
                    <div className="flex gap-3 items-end">
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>Catégorie</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={categoriesLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={categoriesLoading ? "Chargement…" : "Choisir…"}
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories?.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isPublished"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2 rounded-lg border px-3 py-[9px] shrink-0">
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="text-xs cursor-pointer leading-none mb-0">
                                        {field.value ? "Publier" : "Brouillon"}
                                    </FormLabel>
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* ── Submit ── */}
                    <div className="flex justify-end pt-1">
                        <Button type="submit" disabled={isPending || uploading}>
                            {isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Enregistrement…
                                </>
                            ) : isPublished ? "Publier le post" : "Sauvegarder en brouillon"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
