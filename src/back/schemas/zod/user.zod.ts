import { z } from "zod";

export const updateUserSchema = z.object({
    name: z.string().optional(),
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    username: z.string().optional(),
    bio: z.string().optional(),
    image: z.string().optional(),
    avatarUrl: z.string().optional(),
    cv: z.string().optional(),
    portfolio: z.string().optional(),
    isMarketplaceTalent: z.boolean().optional(),
    readyToStart: z.boolean().optional(),
    address: z.string().max(255).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
}).refine(data => Object.keys(data).length > 0, { message: "Aucune donnée à mettre à jour" });

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
