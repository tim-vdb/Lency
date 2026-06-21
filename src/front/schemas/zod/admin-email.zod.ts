import { z } from "zod"
import { AdminEmailBox } from "@/back/generated/prisma_client"

export const sendEmailSchema = z.object({
    toEmail: z.string().email("Email invalide"),
    fromBox: z.nativeEnum(AdminEmailBox),
    subject: z.string().min(1, "Objet requis"),
    htmlContent: z.string().min(1, "Contenu requis"),
    textContent: z.string().optional(),
})

export const replyEmailSchema = z.object({
    htmlContent: z.string().min(1, "Contenu requis"),
    textContent: z.string().optional(),
})

export type SendEmailInput = z.infer<typeof sendEmailSchema>
export type ReplyEmailInput = z.infer<typeof replyEmailSchema>
