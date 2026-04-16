import { z } from "zod"

export const CreateCommentSchema = z.object({
    content: z.string().min(1, "Le commentaire ne peut pas être vide"),
})

export type CreateCommentFormValues = z.infer<typeof CreateCommentSchema>
