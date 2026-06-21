import { z } from "zod";

export const EditBioSchema = z.object({
    bio: z.string().max(300, "300 caractères max").optional(),
});

export type EditBioFormValues = z.infer<typeof EditBioSchema>;

export const SocialLinkSchema = z.object({
    platform: z.string().min(1, "Choisis un réseau"),
    url: z.string().regex(/^https?:\/\/.+/, "URL invalide (commence par http:// ou https://)"),
});

export type SocialLinkFormValues = z.infer<typeof SocialLinkSchema>;
