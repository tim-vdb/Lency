import { Resend } from "resend"
import { AdminEmailAction } from "@/back/repositories/admin-email.action"
import { getUser } from "@/back/lib/auth-session"
import { AdminEmailBox, AdminEmailType } from "@/back/generated/prisma_client"
import type { SendEmailInput, ReplyEmailInput, PatchEmailInput, InboundEmailInput } from "@/back/schemas/zod/admin-email.zod"

const BOX_ADDRESS: Record<AdminEmailBox, string> = {
    SUPPORT: "support@infos.lency.net",
    DEV: "dev@infos.lency.net",
}

function boxFromAddress(address: string): AdminEmailBox | null {
    const normalized = address.toLowerCase().trim()
    if (normalized === "support@infos.lency.net") return AdminEmailBox.SUPPORT
    if (normalized === "dev@infos.lency.net") return AdminEmailBox.DEV
    return null
}

export const AdminEmailService = {
    findAll: async (box?: AdminEmailBox) => {
        const user = await getUser()
        if (!user || user.role !== "ADMIN") throw new Error("Unauthorized")
        return AdminEmailAction.findAll(box)
    },

    findById: async (id: string) => {
        const user = await getUser()
        if (!user || user.role !== "ADMIN") throw new Error("Unauthorized")
        return AdminEmailAction.findById(id)
    },

    send: async (input: SendEmailInput) => {
        const user = await getUser()
        if (!user || user.role !== "ADMIN") throw new Error("Unauthorized")

        const resend = new Resend(process.env.RESEND_API_KEY)
        const fromAddress = BOX_ADDRESS[input.fromBox]

        const { data, error } = await resend.emails.send({
            from: `Lency <${fromAddress}>`,
            to: input.toEmail,
            subject: input.subject,
            html: input.htmlContent,
            text: input.textContent,
        })

        if (error) throw new Error(error.message)

        return AdminEmailAction.create({
            messageId: data?.id,
            type: AdminEmailType.SENT,
            box: input.fromBox,
            fromEmail: fromAddress,
            toEmail: input.toEmail,
            subject: input.subject,
            htmlContent: input.htmlContent,
            textContent: input.textContent,
        })
    },

    reply: async (parentId: string, input: ReplyEmailInput) => {
        const user = await getUser()
        if (!user || user.role !== "ADMIN") throw new Error("Unauthorized")

        const parent = await AdminEmailAction.findById(parentId)
        if (!parent) throw new Error("Email introuvable")

        const resend = new Resend(process.env.RESEND_API_KEY)
        const fromAddress = BOX_ADDRESS[parent.box]
        const replyTo = parent.type === AdminEmailType.RECEIVED ? parent.fromEmail : parent.toEmail

        const { data, error } = await resend.emails.send({
            from: `Lency <${fromAddress}>`,
            to: replyTo,
            subject: `Re: ${parent.subject}`,
            html: input.htmlContent,
            text: input.textContent,
        })

        if (error) throw new Error(error.message)

        return AdminEmailAction.create({
            messageId: data?.id,
            type: AdminEmailType.SENT,
            box: parent.box,
            fromEmail: fromAddress,
            toEmail: replyTo,
            subject: `Re: ${parent.subject}`,
            htmlContent: input.htmlContent,
            textContent: input.textContent,
            parent: { connect: { id: parentId } },
        })
    },

    patch: async (id: string, input: PatchEmailInput) => {
        const user = await getUser()
        if (!user || user.role !== "ADMIN") throw new Error("Unauthorized")
        return AdminEmailAction.update(id, input)
    },

    delete: async (id: string) => {
        const user = await getUser()
        if (!user || user.role !== "ADMIN") throw new Error("Unauthorized")
        return AdminEmailAction.delete(id)
    },

    receiveInbound: async (input: InboundEmailInput) => {
        const toAddresses = Array.isArray(input.to) ? input.to : [input.to]
        const matchedBox = toAddresses
            .map((addr) => boxFromAddress(addr))
            .find((b) => b !== null)

        if (!matchedBox) return null

        const messageId = input.message_id ?? input.messageId
        if (messageId) {
            const existing = await AdminEmailAction.findByMessageId(messageId)
            if (existing) return existing
        }

        let htmlContent: string | undefined = input.html
        let textContent: string | undefined = input.text

        // Parse "Name <email>" format from the from field
        const fromMatch = input.from.match(/^(.+?)\s*<([^>]+)>$/)
        const parsedFromEmail = fromMatch ? fromMatch[2].trim() : input.from.trim()
        const parsedFromName = fromMatch ? fromMatch[1].trim() : undefined

        let fromName: string | undefined = input.sender?.name ?? parsedFromName

        // Fetch full email content via Resend receiving API
        if (input.email_id) {
            try {
                const res = await fetch(
                    `https://api.resend.com/emails/receiving/${input.email_id}`,
                    { headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` } }
                )
                if (res.ok) {
                    const data = await res.json() as { html?: string | null; text?: string | null; from?: string }
                    if (data.html) htmlContent = data.html
                    if (data.text) textContent = data.text
                    if (data.from) {
                        const match = data.from.match(/^(.+?)\s*</)
                        if (match) fromName = match[1].trim()
                    }
                } else {
                    console.error("[inbound] Resend receiving API error:", res.status, await res.text())
                }
            } catch (err) {
                console.error("[inbound] failed to fetch email content:", err)
            }
        }

        return AdminEmailAction.create({
            messageId,
            type: AdminEmailType.RECEIVED,
            box: matchedBox,
            fromEmail: input.sender?.email ?? parsedFromEmail,
            fromName,
            toEmail: BOX_ADDRESS[matchedBox],
            subject: input.subject,
            htmlContent,
            textContent,
        })
    },

    countUnread: async () => {
        const user = await getUser()
        if (!user || user.role !== "ADMIN") throw new Error("Unauthorized")
        const [support, dev] = await Promise.all([
            AdminEmailAction.countUnread(AdminEmailBox.SUPPORT),
            AdminEmailAction.countUnread(AdminEmailBox.DEV),
        ])
        return { support, dev, total: support + dev }
    },
}
