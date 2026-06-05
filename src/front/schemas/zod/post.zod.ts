import { z } from "zod";

export const CreatePostSchema = z.object({
    content: z.string().min(1, "Le contenu est requis"),
    categoryId: z.string().min(1, "Choisissez une catégorie"),
    format: z.enum(["TEXT", "IMAGE", "VIDEO", "AUDIO"]),
    orientation: z.enum(["LANDSCAPE", "PORTRAIT"]).optional(),
    isPublished: z.boolean(),
    imageUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    audioUrl: z.string().optional(),
});

export type CreatePostValues = z.infer<typeof CreatePostSchema>;
