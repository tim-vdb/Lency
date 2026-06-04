import { z } from "zod";

export const createResourceSchema = z.object({
    title: z.string().min(1, "Requis"),
    description: z.string().nullable().optional(),
    type: z.enum(["ASSET", "TUTORIAL", "LINK"]),
    categoryId: z.string().min(1, "Requis"),
    urls: z.array(z.string()).optional(),
    imageUrls: z.array(z.string()).optional(),
    videoUrls: z.array(z.string()).optional(),
    audioUrls: z.array(z.string()).optional(),
});

export const updateResourceSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().nullable().optional(),
    type: z.enum(["ASSET", "TUTORIAL", "LINK"]).optional(),
    categoryId: z.string().optional(),
    urls: z.array(z.string()).optional(),
    imageUrls: z.array(z.string()).optional(),
    videoUrls: z.array(z.string()).optional(),
    audioUrls: z.array(z.string()).optional(),
}).refine(data => Object.keys(data).length > 0, { message: "Aucune donnée à mettre à jour" });

export type CreateResourceInput = z.infer<typeof createResourceSchema>;
export type UpdateResourceInput = z.infer<typeof updateResourceSchema>;
