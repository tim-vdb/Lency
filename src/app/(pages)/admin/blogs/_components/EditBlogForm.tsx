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
import { BLOG_TAGS, type Blog } from "@/front/lib/api/blogs"
import { useUpdateBlog } from "@/front/queries/blogs"
import { uploadToImageKit } from "@/front/lib/upload"
import { useRouter } from "next/navigation"

// ─── Schema ───────────────────────────────────────────────────────────────────

const EditBlogSchema = z.object({
    title: z.string().min(1, "Le titre est requis"),
    content: z.string().min(1, "Le contenu est requis"),
    tag: z.enum(["VIDEO", "MOTION", "OUTILS"], { message: "Choisissez un tag" }),
    coverUrl: z.string().optional(),
    isPublished: z.boolean(),
})

type EditBlogValues = z.infer<typeof EditBlogSchema>

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
            tag: blog.tag,
            coverUrl: blog.coverUrl,
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
                    tag: values.tag,
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
    const titleValue = form.watch("title")
    const contentValue = form.watch("content")

    return (
        <div className="w-full max-w-2xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* ── Titre ── */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">Titre</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Titre de l'article..."
                                        {...field}
                                        className="h-11 text-base"
                                    />
                                </FormControl>
                                <div className="text-xs text-gray-400 text-right">
                                    {titleValue.length} caractères
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Catégorie ── */}
                    <FormField
                        control={form.control}
                        name="tag"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">Catégorie</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger className="h-11">
                                            <SelectValue placeholder="Choisir une catégorie" />
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

                    {/* ── Contenu ── */}
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">Contenu</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Écrivez le contenu de l'article..."
                                        {...field}
                                        rows={12}
                                        className="resize-none text-base"
                                    />
                                </FormControl>
                                <div className="text-xs text-gray-400 text-right">
                                    {contentValue.length} caractères
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Image de couverture ── */}
                    <FormField
                        control={form.control}
                        name="coverUrl"
                        render={({ field: _field }) => (
                            <FormItem>
                                <FormLabel className="text-base font-semibold">
                                    Image de couverture
                                </FormLabel>

                                {coverPreview ? (
                                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={coverPreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={clearCover}
                                            className="absolute top-2 right-2 rounded-lg bg-white/80 p-1 hover:bg-white transition"
                                        >
                                            <X className="size-4 text-gray-600" />
                                        </button>
                                    </div>
                                ) : (
                                    <FormControl>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400 transition"
                                        >
                                            <UploadCloud className="size-6 text-gray-400 mb-2" />
                                            <span className="text-sm text-gray-500">
                                                Cliquez pour ajouter une image
                                            </span>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0]
                                                    if (file) handleFileUpload(file)
                                                }}
                                                className="hidden"
                                            />
                                        </div>
                                    </FormControl>
                                )}
                                {uploading && (
                                    <div className="text-sm text-gray-500 flex items-center gap-2">
                                        <Loader2 className="size-4 animate-spin" />
                                        Upload en cours...
                                    </div>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ── Statut ── */}
                    <FormField
                        control={form.control}
                        name="isPublished"
                        render={({ field }) => (
                            <FormItem>
                                <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-4">
                                    <div className="flex flex-col gap-1">
                                        <FormLabel className="text-base font-semibold cursor-pointer">
                                            {isPublished ? "✨ Publié" : "📝 Brouillon"}
                                        </FormLabel>
                                        <p className="text-sm text-gray-500">
                                            {isPublished
                                                ? "Cet article est visible publiquement"
                                                : "Cet article n'est visible que pour les admins"}
                                        </p>
                                    </div>
                                    <FormControl>
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                </div>
                            </FormItem>
                        )}
                    />

                    {/* ── Actions ── */}
                    <div className="flex items-center gap-3 pt-4">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={isPending || uploading}
                            className="w-full"
                        >
                            {isPending && <Loader2 className="size-4 animate-spin mr-2" />}
                            {isPending
                                ? "Modification en cours..."
                                : isPublished
                                  ? "✨ Publier l'article"
                                  : "💾 Sauvegarder"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="lg"
                            onClick={() => router.back()}
                        >
                            Annuler
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
