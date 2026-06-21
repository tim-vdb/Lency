import { z } from "zod"

export const CreateCommentSchema = z
    .object({
        content: z.string(),
        imageUrls: z.array(z.string()),
        videoUrls: z.array(z.string()),
        audioUrls: z.array(z.string()),
    })
    .refine(
        (v) =>
            (v.content && v.content.trim().length > 0) ||
            v.imageUrls.length > 0 ||
            v.videoUrls.length > 0 ||
            v.audioUrls.length > 0,
        { message: "Ajoutez un message ou un média", path: ["content"] }
    )

export type CreateCommentFormValues = z.infer<typeof CreateCommentSchema>
