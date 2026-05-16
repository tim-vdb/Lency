import { z } from "zod"

export const CreateCommentSchema = z
    .object({
        content: z.string(),
        imageUrl: z.string().url().optional().nullable(),
        videoUrl: z.string().url().optional().nullable(),
    })
    .refine(
        (v) =>
            (v.content && v.content.trim().length > 0) ||
            !!v.imageUrl ||
            !!v.videoUrl,
        {
            message: "Ajoutez un message, une image ou une vidéo",
            path: ["content"],
        }
    )

export type CreateCommentFormValues = z.infer<typeof CreateCommentSchema>
