import { z } from "zod";

const baseResourceSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(150, "Maximum 150 caractères"),
    description: z.string().max(500, "Maximum 500 caractères").optional().or(z.literal("")),
    type: z.enum(["ASSET", "TUTORIAL", "LINK"], { error: "Le type est requis" }),
    categoryId: z.string().min(1, "La catégorie est requise"),
    urls: z.array(z.string()),
    imageUrls: z.array(z.string()),
    videoUrls: z.array(z.string()),
    audioUrls: z.array(z.string()),
});

export const CreateResourceSchema = baseResourceSchema.superRefine((val, ctx) => {
    if (val.type === "LINK") {
        const valid = val.urls.filter((u) => u.match(/^https?:\/\/.+/));
        if (valid.length === 0) {
            ctx.addIssue({ code: "custom", message: "Au moins un lien valide requis (https://…)", path: ["urls"] });
        }
    } else {
        const hasMedia =
            val.imageUrls.some(Boolean) ||
            val.videoUrls.some(Boolean) ||
            val.audioUrls.some(Boolean) ||
            val.urls.some((u) => u.match(/^https?:\/\/.+/));
        if (!hasMedia) {
            ctx.addIssue({ code: "custom", message: "Ajoute au moins un fichier ou une URL", path: ["imageUrls"] });
        }
    }
});

export type CreateResourceValues = z.infer<typeof CreateResourceSchema>;
