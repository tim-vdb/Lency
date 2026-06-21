"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { BookOpen, Loader2, Plus, Tag, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
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
import { Switch } from "@/front/components/ui/switch"
import { Textarea } from "@/front/components/ui/textarea"
import { Badge } from "@/front/components/ui/badge"
import { useCreateBlog } from "@/front/queries/blogs"
import { BLOG_TAG_SUGGESTIONS } from "@/front/lib/api/blogs"
import { uploadToImageKit } from "@/front/lib/upload"
import { cn } from "@/front/lib/utils"

// ─── Schema ───────────────────────────────────────────────────────────────────

const CreateBlogSchema = z.object({
    title: z.string().min(1, "Le titre est requis").min(3, "Le titre doit faire au moins 3 caractères"),
    content: z.string().min(1, "Le contenu est requis").min(10, "Le contenu doit faire au moins 10 caractères"),
    tags: z.array(z.string()).min(1, "Au moins un tag requis"),
    coverUrl: z.string().optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).optional(),
})

type CreateBlogValues = z.infer<typeof CreateBlogSchema>

// ─── TagsInput ────────────────────────────────────────────────────────────────

function TagsInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
    const [input, setInput] = useState("")
    const [open, setOpen] = useState(false)
    const wrapperRef = useRef<HTMLDivElement>(null)

    const filtered = input.length > 0
        ? BLOG_TAG_SUGGESTIONS.filter(s => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s))
        : BLOG_TAG_SUGGESTIONS.filter(s => !value.includes(s))

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as HTMLElement)) setOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    function add(v: string) {
        const trimmed = v.trim()
        if (!trimmed || value.includes(trimmed)) return
        onChange([...value, trimmed])
        setInput("")
        setOpen(false)
    }

    return (
        <div className="flex flex-col gap-2">
            {value.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {value.map(v => (
                        <Badge key={v} variant="secondary" className="gap-1 pr-1 text-xs font-normal">
                            {v}
                            <button type="button" onClick={() => onChange(value.filter(r => r !== v))} className="ml-0.5 hover:text-destructive transition-colors">
                                <X className="w-3 h-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}
            <div ref={wrapperRef} className="relative">
                <div className="flex gap-2">
                    <Input
                        value={input}
                        onChange={e => { setInput(e.target.value); setOpen(true) }}
                        onFocus={() => setOpen(true)}
                        onKeyDown={e => {
                            if (e.key === "Enter") { e.preventDefault(); add(input) }
                            if (e.key === "Escape") setOpen(false)
                        }}
                        placeholder="Vidéo, Motion, Outils…"
                        className="h-11"
                    />
                    <Button type="button" variant="outline" className="h-11 px-3 shrink-0" onClick={() => add(input)} disabled={!input.trim()}>
                        <Plus className="size-4" />
                    </Button>
                </div>
                {open && filtered.length > 0 && (
                    <ul className="absolute z-50 top-full mt-1 left-0 right-0 max-h-48 overflow-y-auto rounded-md border border-border bg-popover shadow-md text-sm">
                        {filtered.map(s => (
                            <li key={s}>
                                <button type="button" className="w-full text-left px-3 py-1.5 hover:bg-accent hover:text-accent-foreground" onMouseDown={e => { e.preventDefault(); add(s) }}>
                                    {s}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

// ─── Component ────────────────────────────────────────────────────────────────

interface CreateBlogFormProps {
    onSuccess: () => void
}

export function CreateBlogForm({ onSuccess }: CreateBlogFormProps) {
    const { mutate, isPending } = useCreateBlog()
    const [uploading, setUploading] = useState(false)
    const [coverPreview, setCoverPreview] = useState<string | null>(null)
    const [coverName, setCoverName] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<CreateBlogValues>({
        resolver: zodResolver(CreateBlogSchema),
        defaultValues: {
            title: "",
            content: "",
            tags: [],
            coverUrl: undefined,
            status: "DRAFT",
        },
    })

    // ── Cover upload ──────────────────────────────────────────────────────────

    async function handleFileUpload(file: File) {
        setUploading(true)
        try {
            const url = await uploadToImageKit(file, "/blogs")
            form.setValue("coverUrl", url)
            setCoverName(file.name)
            setCoverPreview(URL.createObjectURL(file))
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erreur upload")
        } finally {
            setUploading(false)
        }
    }

    function clearCover() {
        form.setValue("coverUrl", undefined)
        setCoverPreview(null)
        setCoverName(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    // ── Submit ────────────────────────────────────────────────────────────────

    function onSubmit(values: CreateBlogValues) {
        mutate(values, {
            onSuccess: () => {
                toast.success(
                    values.status === "PUBLISHED" 
                        ? "Article publié !" 
                        : "Article sauvegardé en brouillon."
                )
                onSuccess()
            },
            onError: (err) => toast.error(err.message),
        })
    }

    const isPublished = form.watch("status") === "PUBLISHED"

    return (
        <div className="w-full max-w-5xl">
            {/* ─── Header ─── */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                        <BookOpen className="size-5 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold">Créer un article</h1>
                </div>
                <p className="text-muted-foreground">                Partager votre expertise avec la communauté</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* ─── Form ─── */}
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">

                            {/* ── Titre ── */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Titre</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Un titre accrocheur…" 
                                                className="h-11"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground mt-1">{field.value?.length || 0} caractères</p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* ── Tags ── */}
                            <FormField
                                control={form.control}
                                name="tags"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold flex items-center gap-2">
                                            <Tag className="size-4" />
                                            Tags
                                        </FormLabel>
                                        <FormControl>
                                            <TagsInput value={field.value} onChange={field.onChange} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* ── Image de couverture ── */}
                            <FormItem>
                                <FormLabel className="text-base font-semibold">Image de couverture</FormLabel>
                                <div className="mt-2">
                                    {coverName ? (
                                        <div className="relative rounded-lg border-2 border-primary/20 overflow-hidden bg-muted/50">
                                            {coverPreview && (
                                                <img
                                                    src={coverPreview}
                                                    alt="preview"
                                                    className="w-full h-48 object-cover"
                                                />
                                            )}
                                            <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
                                            <button
                                                type="button"
                                                onClick={clearCover}
                                                className="absolute top-2 right-2 rounded-full bg-black/70 p-1.5 text-white hover:bg-black/90 transition-colors"
                                            >
                                                <X className="size-4" />
                                            </button>
                                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white text-xs font-medium bg-linear-to-t from-black/60">
                                                {coverName}
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled={uploading}
                                            onClick={() => fileInputRef.current?.click()}
                                            className={cn(
                                                "w-full rounded-lg border-2 border-dashed border-primary/30 px-4 py-12 text-center transition-all hover:border-primary/60 hover:bg-primary/5 disabled:opacity-50"
                                            )}
                                        >
                                            {uploading ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <Loader2 className="size-4 animate-spin text-primary" />
                                                    <span className="text-sm font-medium">Chargement…</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="p-2 rounded-lg bg-primary/10">
                                                        <BookOpen className="size-5 text-primary" />
                                                    </div>
                                                    <span className="text-sm font-medium">Cliquez pour ajouter une image</span>
                                                    <span className="text-xs text-muted-foreground">JPG, PNG, WebP • Recommandé : 1200x630px</span>
                                                </div>
                                            )}
                                        </button>
                                    )}

                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                handleFileUpload(e.target.files[0])
                                            }
                                        }}
                                    />
                                </div>
                            </FormItem>

                            {/* ── Contenu ── */}
                            <FormField
                                control={form.control}
                                name="content"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold">Contenu</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Écrivez votre article ici… Vous pouvez utiliser Markdown pour le formatage."
                                                className="min-h-64 resize-none text-base leading-relaxed"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <div className="flex justify-between items-center mt-2">
                                            <p className="text-xs text-muted-foreground">{field.value?.length || 0} caractères</p>
                                            {field.value?.length! < 10 && field.value?.length! > 0 && (
                                                <p className="text-xs text-amber-600">Minimum 10 caractères</p>
                                            )}
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* ── Status toggle ── */}
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="flex items-center justify-between rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
                                        <div className="flex flex-col gap-1">
                                            <FormLabel className="text-base font-semibold">
                                                {isPublished ? "✨ Publié" : "📝 Brouillon"}
                                            </FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                {isPublished 
                                                    ? "Visible par toute la communauté" 
                                                    : "Vous seul pouvez le voir"
                                                }
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value === "PUBLISHED"}
                                                onCheckedChange={(checked) => {
                                                    field.onChange(checked ? "PUBLISHED" : "DRAFT")
                                                }}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {/* ── Actions ── */}
                            <div className="flex gap-3 pt-4">
                                <Button 
                                    type="submit" 
                                    disabled={isPending}
                                    size="lg"
                                    className="flex-1 h-11"
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 size-4 animate-spin" />
                                            Création…
                                        </>
                                    ) : (
                                        isPublished ? "✨ Publier l'article" : "💾 Sauvegarder"
                                    )}
                                </Button>
                            </div>

                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}
