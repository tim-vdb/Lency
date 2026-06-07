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

export const patchEmailSchema = z.object({
    isRead: z.boolean().optional(),
    isStarred: z.boolean().optional(),
})

export const inboundEmailSchema = z.object({
    email_id: z.string().optional(),
    message_id: z.string().optional(),
    from: z.string(),
    to: z.union([z.string(), z.array(z.string())]),
    subject: z.string(),
    html: z.string().optional(),
    text: z.string().optional(),
    headers: z.record(z.string(), z.string()).optional(),
    sender: z.object({
        name: z.string().optional(),
        email: z.string(),
    }).optional(),
})

export type SendEmailInput = z.infer<typeof sendEmailSchema>
export type ReplyEmailInput = z.infer<typeof replyEmailSchema>
export type PatchEmailInput = z.infer<typeof patchEmailSchema>
export type InboundEmailInput = z.infer<typeof inboundEmailSchema> & { messageId?: string; message_id?: string }
