"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/front/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/front/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/front/components/ui/field"
import { Input } from "@/front/components/ui/input"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    InputGroupTextarea,
} from "@/front/components/ui/input-group"
import { useCreateCategory } from "@/front/hooks/querys/use-categories"

// Schéma de validation pour le formulaire
const formSchema = z.object({
    name: z
        .string()
        .min(3, "Le nom doit contenir au moins 3 caractères.")
        .max(50, "Le nom doit contenir au maximum 50 caractères."),
    slug: z
        .string()
        .min(3, "Le slug doit contenir au moins 3 caractères.")
        .max(50, "Le slug doit contenir au maximum 50 caractères.")
        .regex(/^[a-z0-9-]+$/, "Le slug ne peut contenir que des lettres minuscules, chiffres et tirets."),
    description: z
        .string()
        .min(20, "La description doit contenir au moins 20 caractères.")
        .max(500, "La description doit contenir au maximum 500 caractères.")
        .optional(),
})

export default function CreateCategoryForm(): React.ReactElement {
    // Hook React Query pour créer une catégorie
    // Gère automatiquement: loading state, erreurs, cache invalidation
    const createCategoryMutation = useCreateCategory()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            slug: "",
            description: "",
        },
    })

    // Fonction appelée à la soumission du formulaire
    function onSubmit(data: z.infer<typeof formSchema>) {
        // Appelle la mutation React Query
        createCategoryMutation.mutate(
            {
                name: data.name,
                slug: data.slug,
                description: data.description,
            },
            {
                // Callback de succès
                onSuccess: (newCategory) => {
                    toast.success("Catégorie créée avec succès !", {
                        description: `La catégorie "${newCategory.name}" a été créée.`,
                        position: "bottom-right",
                    })
                    // Reset le formulaire après succès
                    form.reset()
                },
                // Callback d'erreur
                onError: (error) => {
                    toast.error("Erreur lors de la création", {
                        description: error instanceof Error ? error.message : "Une erreur est survenue.",
                        position: "bottom-right",
                    })
                },
            }
        )
    }

    // Auto-génère le slug depuis le nom
    const handleNameChange = (value: string) => {
        const slug = value
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Retire les accents
            .replace(/[^a-z0-9\s-]/g, "") // Garde seulement lettres, chiffres, espaces et tirets
            .replace(/\s+/g, "-") // Remplace espaces par tirets
            .replace(/-+/g, "-") // Remplace multiples tirets par un seul
            .trim()
        form.setValue("slug", slug)
    }

    return (
        <Card className="w-full sm:max-w-md">
            <CardHeader>
                <CardTitle>Créer une catégorie</CardTitle>
                <CardDescription>
                    Ajoutez une nouvelle catégorie pour organiser les discussions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form id="form-category" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        {/* Champ Nom */}
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-category-name">
                                        Nom de la catégorie
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-category-name"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="ex: Technologie"
                                        autoComplete="off"
                                        onChange={(e) => {
                                            field.onChange(e)
                                            handleNameChange(e.target.value)
                                        }}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Champ Slug */}
                        <Controller
                            name="slug"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-category-slug">
                                        Slug (URL)
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="form-category-slug"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="ex: technologie"
                                        autoComplete="off"
                                    />
                                    <FieldDescription>
                                        Généré automatiquement depuis le nom. Uniquement lettres minuscules, chiffres et tirets.
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Champ Description */}
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-category-description">
                                        Description (optionnel)
                                    </FieldLabel>
                                    <InputGroup>
                                        <InputGroupTextarea
                                            {...field}
                                            id="form-category-description"
                                            placeholder="Décrivez brièvement cette catégorie..."
                                            rows={4}
                                            className="min-h-24 resize-none"
                                            aria-invalid={fieldState.invalid}
                                        />
                                        <InputGroupAddon align="block-end">
                                            <InputGroupText className="tabular-nums">
                                                {field.value?.length || 0}/500 caractères
                                            </InputGroupText>
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <FieldDescription>
                                        Expliquez le thème et le type de discussions attendues.
                                    </FieldDescription>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => form.reset()}
                        disabled={createCategoryMutation.isPending}
                    >
                        Réinitialiser
                    </Button>
                    <Button
                        type="submit"
                        form="form-category"
                        disabled={createCategoryMutation.isPending}
                    >
                        {createCategoryMutation.isPending ? "Création..." : "Créer"}
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}
