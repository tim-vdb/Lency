"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, UploadCloud, X } from "lucide-react"
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
import { Switch } from "@/front/components/ui/switch"
import { Textarea } from "@/front/components/ui/textarea"
import { BLOG_TAGS } from "@/front/lib/api/blogs"
import { useCreateBlog } from "@/front/hooks/queries/use-blogs"
import { uploadToImageKit } from "@/front/lib/api/upload"

// ─── Schema ───────────────────────────────────────────────────────────────────

const CreateBlogSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    content: z.string().min(1, "Le contenu est requis"),
    tag: z.enum(["VIDEO", "MOTION", "OUTILS"], { message: "Choisissez un tag" }),
    coverUrl: z.string().optional(),
    isPublished: z.boolean(),
})

type CreateBlogValues = z.infer<typeof CreateBlogSchema>

// ─── Component ────────────────────────────────────────────────────────────────

export default function CreateBlogForm() {
    const { mutate, isPending } = useCreateBlog()
    const [uploading, setUploading] = useState(false)
    const [coverPreview, setCoverPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<CreateBlogValues>({
        resolver: zodResolver(CreateBlogSchema),
        defaultValues: {
            title: "",
            content: "",
            tag: undefined,
            coverUrl: undefined,
            isPublished: false,
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

    function onSubmit(values: CreateBlogValues) {
        mutate(
            {
                title: values.title,
                content: values.content,
                tag: values.tag,
                coverUrl: values.coverUrl,
                status: values.isPublished ? "PUBLISHED" : "DRAFT",
            },
            {
                onSuccess: () => {
                    toast.success(values.isPublished ? "Article publié !" : "Brouillon sauvegardé.")
                    form.reset()
                    setCoverPreview(null)
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
                            className="w-full rounded-xl border-2 border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-400 hover:border-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
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

                {/* ── Tag + Publier ── */}
                <div className="flex gap-3 items-end">
                    <FormField
                        control={form.control}
                        name="tag"
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormLabel>Tag</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisir un tag…" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {BLOG_TAGS.map(({ value, label }) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
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
                        ) : isPublished ? "Publier l'article" : "Sauvegarder en brouillon"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}