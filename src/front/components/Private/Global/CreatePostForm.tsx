"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/front/components/ui/select"
import { Switch } from "@/front/components/ui/switch"
import { Textarea } from "@/front/components/ui/textarea"
import { useCategories } from "@/front/hooks/querys/use-categories"
import { useCreatePost } from "@/front/hooks/querys/use-posts"

// ─── Schema ───────────────────────────────────────────────────────────────────

const POST_FORMATS = ["DESKTOP", "MOBILE", "AUDIO", "TEXT"] as const
type PostFormat = typeof POST_FORMATS[number]

const FORMAT_LABELS: Record<PostFormat, string> = {
    DESKTOP: "Desktop",
    MOBILE: "Mobile",
    AUDIO: "Audio",
    TEXT: "Texte",
}

const CreatePostSchema = z.object({
    title: z
        .string()
        .min(3, "Minimum 3 caractères")
        .max(200, "Maximum 200 caractères"),
    content: z.string().min(10, "Minimum 10 caractères"),
    categoryId: z.string().min(1, "Choisissez une catégorie"),
    format: z.enum(POST_FORMATS),
    isPublished: z.boolean(),
})

type CreatePostValues = z.infer<typeof CreatePostSchema>

// ─── Component ────────────────────────────────────────────────────────────────

interface CreatePostFormProps {
    onSuccess: () => void
}

export function CreatePostForm({ onSuccess }: CreatePostFormProps) {
    const { mutate, isPending } = useCreatePost()
    const { data: categories, isLoading: categoriesLoading } = useCategories()

    const form = useForm<CreatePostValues>({
        resolver: zodResolver(CreatePostSchema),
        defaultValues: {
            title: "",
            content: "",
            categoryId: "",
            format: "DESKTOP",
            isPublished: false,
        },
    })

    function onSubmit(values: CreatePostValues) {
        mutate(values, {
            onSuccess: () => {
                toast.success(
                    values.isPublished ? "Post publié !" : "Post sauvegardé en brouillon."
                )
                onSuccess()
            },
            onError: (err) => {
                toast.error(err.message)
            },
        })
    }

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h2 className="text-lg font-semibold">Créer un post</h2>
                <p className="text-sm text-muted-foreground">
                    Partagez votre contenu avec la communauté.
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    {/* Titre */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Titre</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Donnez un titre à votre post…"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Contenu */}
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Contenu</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Écrivez votre contenu ici…"
                                        className="min-h-28 resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Catégorie + Format sur la même ligne */}
                    <div className="grid grid-cols-2 gap-3">
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Catégorie</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        disabled={categoriesLoading}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue
                                                    placeholder={
                                                        categoriesLoading
                                                            ? "Chargement…"
                                                            : "Choisir…"
                                                    }
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
                            name="format"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Format</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {POST_FORMATS.map((f) => (
                                                <SelectItem key={f} value={f}>
                                                    {FORMAT_LABELS[f]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    {/* Publier maintenant */}
                    <FormField
                        control={form.control}
                        name="isPublished"
                        render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border px-4 py-3">
                                <div>
                                    <FormLabel>Publier maintenant</FormLabel>
                                    <FormDescription className="text-xs">
                                        Désactivé = sauvegardé en brouillon
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end pt-1">
                        <Button type="submit" disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Enregistrement…
                                </>
                            ) : form.watch("isPublished") ? (
                                "Publier le post"
                            ) : (
                                "Sauvegarder en brouillon"
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
