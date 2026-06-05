import { z } from "zod";

export const CreateCategorySchema = z.object({
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
});

export type CreateCategoryValues = z.infer<typeof CreateCategorySchema>;

export const AdminCreateCategorySchema = z.object({
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
});

export type AdminCreateCategoryValues = z.infer<typeof AdminCreateCategorySchema>;
