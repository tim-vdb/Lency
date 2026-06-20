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
import { CreatePostSchema, type CreatePostValues } from "@/front/schemas/zod/post.zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/front/components/ui/form"
import { MultistepForm, MultistepNavigation, MultistepStep } from "@/front/components/ui/multistep-form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/front/components/ui/select"
import { Switch } from "@/front/components/ui/switch"
import { Textarea } from "@/front/components/ui/textarea"
import { useCategories } from "@/front/queries/categories"
import { useCreatePost, useUpdatePost } from "@/front/queries/posts"
import { uploadToImageKit } from "@/front/lib/upload"
import { cn } from "@/front/lib/utils"
import { PostWithUserState } from "@/front/schemas/types/post.type"

// ─── Types ────────────────────────────────────────────────────────────────────

const CONTENT_TYPES = ["TEXT", "IMAGE", "VIDEO", "AUDIO"] as const
type ContentType = (typeof CONTENT_TYPES)[number]

type ContentConfig = {
    label: string
    icon: React.ElementType
    accept: string
    mediaKey: "imageUrl" | "videoUrl" | "audioUrl" | null
    hint: string
    hasOrientation: boolean
}

const CONTENT_CONFIG: Record<ContentType, ContentConfig> = {
    TEXT: { label: "Texte", icon: FileText, accept: "", mediaKey: null, hint: "", hasOrientation: false },
    IMAGE: { label: "Image", icon: ImageIcon, accept: "image/*", mediaKey: "imageUrl", hint: "JPG, PNG, WebP", hasOrientation: true },
    VIDEO: { label: "Vidéo", icon: Video, accept: "video/*", mediaKey: "videoUrl", hint: "MP4, WebM", hasOrientation: true },
    AUDIO: { label: "Audio", icon: Music, accept: "audio/*", mediaKey: "audioUrl", hint: "MP3, WAV, OGG", hasOrientation: false },
}

const STEPS = [
    { id: "contenu", title: "Contenu" },
    { id: "publication", title: "Publication" },
]

// ─── Component ────────────────────────────────────────────────────────────────

interface CreatePostFormProps {
    onSuccess: () => void
    initialData?: PostWithUserState
    mode?: "create" | "edit"
}

export function CreatePostForm({ onSuccess, initialData, mode = "create" }: CreatePostFormProps) {
    const isEdit = mode === "edit"
    const { mutate: mutateCreate, isPending: isCreating } = useCreatePost()
    const { mutate: mutateUpdate, isPending: isUpdating } = useUpdatePost()
    const isPending = isEdit ? isUpdating : isCreating
    const { data: categories, isLoading: categoriesLoading } = useCategories()

    const initialFormat = (initialData?.format as ContentType | undefined) ?? "TEXT"
    const [contentType, setContentType] = useState<ContentType>(initialFormat)
    const [isMobile, setIsMobile] = useState(initialData?.orientation === "PORTRAIT")
    const [uploading, setUploading] = useState(false)
    const [mediaPreview, setMediaPreview] = useState<string | null>(initialData?.imageUrl ?? null)
    const [mediaName, setMediaName] = useState<string | null>(initialData?.imageUrl ? "Fichier existant" : null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const config = CONTENT_CONFIG[contentType]

    const form = useForm<CreatePostValues>({
        resolver: zodResolver(CreatePostSchema),
        defaultValues: isEdit && initialData ? {
            content: initialData.content,
            categoryId: initialData.categoryId,
            format: initialData.format as ContentType,
            orientation: initialData.orientation as "LANDSCAPE" | "PORTRAIT" | undefined,
            isPublished: initialData.isPublished,
            imageUrl: initialData.imageUrl ?? undefined,
            videoUrl: initialData.videoUrl ?? undefined,
            audioUrl: initialData.audioUrl ?? undefined,
        } : {
            content: "",
            categoryId: "",
            format: "TEXT",
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
        const callbacks = {
            onSuccess: () => {
                toast.success(values.isPublished ? "Post publié !" : "Post sauvegardé en brouillon.")
                onSuccess()
            },
            onError: (err: Error) => toast.error(err.message),
        }
        if (isEdit && initialData) {
            mutateUpdate({ id: initialData.id, data: values }, callbacks)
        } else {
            mutateCreate(values, callbacks)
        }
    }

    const isPublished = form.watch("isPublished")

    return (
        <Form {...form}>
            <MultistepForm
                steps={STEPS}
                onFormSubmit={form.handleSubmit(onSubmit)}
                navigation={
                    <MultistepNavigation
                        onNext={async (step) => {
                            if (step === 0) return form.trigger(["content"])
                            return true
                        }}
                        isPending={isPending}
                        disabled={uploading}
                        submitLabel={isEdit
                            ? (isPublished ? "Mettre à jour et publier" : "Enregistrer les modifications")
                            : (isPublished ? "Publier le post" : "Sauvegarder en brouillon")
                        }
                    />
                }
            >
                {/* ── Étape 1 : Contenu ── */}
                <MultistepStep title="Contenu du post"                         description="Choisir un format et rédiger votre contenu.">
                    {/* Sélecteur de type */}
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

                    {/* Orientation (IMAGE / VIDEO uniquement) */}
                    {config.hasOrientation && (
                        <div className="flex items-center gap-1 rounded-lg border p-1 w-fit">
                            <button
                                type="button"
                                onClick={() => toggleOrientation(false)}
                                className={cn(
                                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                                    !isMobile ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
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
                                    isMobile ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <Smartphone className="size-3.5" />
                                Portrait
                            </button>
                        </div>
                    )}

                    {/* Zone upload media */}
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
                                            className={cn("w-full object-cover", isMobile ? "aspect-9/16" : "h-36")}
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
                                onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileUpload(file) }}
                            />
                        </div>
                    )}

                    {/* Contenu */}
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{contentType === "TEXT" ? "Contenu" : "Description (optionnel)"}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder={contentType === "TEXT" ? "Écrivez votre contenu…" : "Ajoutez une description…"}
                                        className={cn("resize-none", contentType === "TEXT" ? "min-h-28" : "min-h-16")}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </MultistepStep>

                {/* ── Étape 2 : Publication ── */}
                <MultistepStep title="Publication" description="Choisissez une communauté et le statut de publication.">
                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Communauté</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={categoriesLoading}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder={categoriesLoading ? "Chargement…" : "Choisir…"} />
                                        </SelectTrigger>
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

                    <FormField
                        control={form.control}
                        name="isPublished"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-3 rounded-lg border px-4 py-3">
                                <FormControl>
                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="flex flex-col gap-0.5">
                                    <FormLabel className="text-sm cursor-pointer leading-none mb-0">
                                        {field.value ? "Publier maintenant" : "Sauvegarder en brouillon"}
                                    </FormLabel>
                                    <p className="text-xs text-muted-foreground">
                                        {field.value ? "Visible par la communauté." : "Vous pourrez le publier plus tard."}
                                    </p>
                                </div>
                            </FormItem>
                        )}
                    />
                </MultistepStep>
            </MultistepForm>
        </Form>
    )
}
