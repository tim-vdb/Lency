import { z } from "zod";

export const createPostSchema = z.object({
    content: z.string().min(1, "Requis"),
    categoryId: z.string().min(1, "Requis"),
    format: z.enum(["TEXT", "IMAGE", "VIDEO", "AUDIO"]).optional(),
    orientation: z.enum(["LANDSCAPE", "PORTRAIT"]).optional(),
    imageUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    audioUrl: z.string().optional(),
    isPublished: z.boolean().optional(),
});

export const updatePostSchema = z.object({
    content: z.string().min(1).optional(),
    isPublished: z.boolean().optional(),
    isLocked: z.boolean().optional(),
    categoryId: z.string().optional(),
    imageUrl: z.string().optional(),
    videoUrl: z.string().optional(),
    audioUrl: z.string().optional(),
}).refine(data => Object.keys(data).length > 0, { message: "Aucune donnée à mettre à jour" });

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
