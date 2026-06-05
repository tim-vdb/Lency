import { z } from "zod"

export const VerifyEmailChangeSchema = z.object({
    currentPassword: z.string().min(1, "Le mot de passe est requis"),
    newEmail: z.string().email("Adresse email invalide"),
})

export type VerifyEmailChangeValues = z.infer<typeof VerifyEmailChangeSchema>
