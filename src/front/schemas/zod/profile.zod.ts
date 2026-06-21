import { z } from "zod"

export const UpdateProfileSchema = z.object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
})

export type UpdateProfileFormValues = z.infer<typeof UpdateProfileSchema>
