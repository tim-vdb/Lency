import { z } from "zod";

export const TalentProfileSchema = z.object({
    bio: z.string().max(500, "Max 500 caractères").optional(),
    portfolio: z.string().url("URL invalide").or(z.literal("")).optional(),
    cv: z.string().url("URL invalide").or(z.literal("")).optional(),
    isMarketplaceTalent: z.boolean(),
});

export type TalentProfileValues = z.infer<typeof TalentProfileSchema>;

export const TalentProfileModalSchema = z.object({
    bio: z.string().max(500, "Maximum 500 caractères").optional(),
    portfolio: z.string().url("URL invalide").or(z.literal("")).optional(),
    cv: z.string().url("URL invalide").or(z.literal("")).optional(),
    isMarketplaceTalent: z.boolean(),
    workMode: z.string().optional(),
    level: z.string().optional(),
    remunerationType: z.string().optional(),
    address: z.string().max(255).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

export type TalentProfileModalValues = z.infer<typeof TalentProfileModalSchema>;
