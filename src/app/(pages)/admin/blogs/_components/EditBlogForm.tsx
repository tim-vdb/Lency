"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, UploadCloud, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Badge } from "@/front/components/ui/badge"
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
import { BLOG_TAG_SUGGESTIONS, type Blog } from "@/front/lib/api/blogs"
import { useUpdateBlog } from "@/front/queries/blogs"
import { uploadToImageKit } from "@/front/lib/upload"
import { useRouter } from "next/navigation"

const EditBlogSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    content: z.string().min(1, "Le contenu est requis"),
    tags: z.array(z.string()).min(1, "Au moins un tag requis"),
    coverUrl: z.string().optional(),
    isPublished: z.boolean(),
})

type EditBlogValues = z.infer<typeof EditBlogSchema>

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
                        className="h-8 text-sm"
                    />
                    <Button type="button" size="sm" variant="outline" className="h-8 px-2 shrink-0" onClick={() => add(input)} disabled={!input.trim()}>
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

interface EditBlogFormProps {
    blog: Blog
    onSuccess?: () => void
}

export default function EditBlogForm({ blog, onSuccess }: EditBlogFormProps) {
    const router = useRouter()
    const { mutate, isPending } = useUpdateBlog()
    const [uploading, setUploading] = useState(false)
    const [coverPreview, setCoverPreview] = useState<string | null>(blog.coverUrl || null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<EditBlogValues>({
        resolver: zodResolver(EditBlogSchema),
        defaultValues: {
            title: blog.title,
            content: blog.content,
            tags: blog.tags,
            coverUrl: blog.coverUrl ?? undefined,
            isPublished: blog.status === "PUBLISHED",
        },
    })

    async function handleFileUpload(file: File) {
        setUploading(true)
        try {
            const url = await uploadToImageKit(file, "/blogs")
            form.setValue("coverUrl", url)
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
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    function onSubmit(values: EditBlogValues) {
        mutate(
            {
                id: blog.id,
                data: {
                    title: values.title,
                    content: values.content,
                    tags: values.tags,
                    coverUrl: values.coverUrl,
                    status: values.isPublished ? "PUBLISHED" : "DRAFT",
                },
            },
            {
                onSuccess: () => {
                    toast.success(values.isPublished ? "Article publié !" : "Brouillon sauvegardé.")
                    onSuccess?.()
                    router.push("/admin/blogs")
                },
                onError: (err) => toast.error(err.message),
            }
        )
    }

    const isPublished = form.watch("isPublished")

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">

                {/* ── Cover ── */}
                <div className="flex flex-col gap-1.5">
                    <FormLabel>Image de couverture</FormLabel>
                    {coverPreview ? (
                        <div className="relative rounded-xl overflow-hidden">
                            <img src={coverPreview} alt="cover" className="w-full h-48 object-cover" />
                            <button
                                type="button"
                                onClick={clearCover}
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
                            className="w-full rounded-xl border-2 border-dashed border-gray-200 px-4 py-8 text-center text-sm text-neutral-400 hover:border-gray-400 hover:text-neutral-600 transition-colors disabled:opacity-50"
                        >
                            {uploading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="size-4 animate-spin" />
                                    Upload…
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-1.5">
                                    <UploadCloud className="size-5" />
                                    <span className="text-xs">Cliquez pour ajouter une image</span>
                                    <span className="text-[10px] opacity-60">JPG, PNG, WebP</span>
                                </div>
                            )}
                        </button>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file)
                        }}
                    />
                </div>

                {/* ── Titre ── */}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Titre</FormLabel>
                            <FormControl>
                                <Input placeholder="Titre de l'article…" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* ── Contenu ── */}
                <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Contenu</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Rédigez votre article…"
                                    className="min-h-40 resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* ── Tags + Publier ── */}
                <div className="flex gap-3 items-start">
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <TagsInput value={field.value} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isPublished"
                        render={({ field }) => (
                            <FormItem className="flex items-center gap-2 rounded-lg border px-3 py-[9px] shrink-0 mt-[22px]">
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
                <div className="flex items-center gap-3 pt-1">
                    <Button type="submit" disabled={isPending || uploading} className="flex-1">
                        {isPending ? (
                            <>
                                <Loader2 className="size-4 animate-spin" />
                                Enregistrement…
                            </>
                        ) : isPublished ? "Publier l'article" : "Sauvegarder en brouillon"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Annuler
                    </Button>
                </div>
            </form>
        </Form>
    )
}
