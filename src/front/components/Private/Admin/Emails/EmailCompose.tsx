"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { sendEmailSchema, type SendEmailInput } from "@/front/schemas/zod/admin-email.zod"
import { useSendAdminEmail } from "@/front/queries/admin-emails"
import { AdminEmailBox } from "@/back/generated/prisma_client"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/front/components/ui/dialog"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/front/components/ui/form"
import { Input } from "@/front/components/ui/input"
import { Button } from "@/front/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/front/components/ui/select"
import { TiptapEditor } from "@/front/components/ui/tiptap-editor"
import { Send } from "lucide-react"

type EmailComposeProps = {
    open: boolean
    onClose: () => void
    defaultBox?: AdminEmailBox
    replyTo?: { parentId: string; toEmail: string; subject: string; box: AdminEmailBox }
    onSent?: () => void
}

export function EmailCompose({ open, onClose, defaultBox, replyTo, onSent }: EmailComposeProps) {
    const { mutate: send, isPending } = useSendAdminEmail()
    const [html, setHtml] = useState("")

    const form = useForm<SendEmailInput>({
        resolver: zodResolver(sendEmailSchema),
        defaultValues: {
            toEmail: replyTo?.toEmail ?? "",
            fromBox: replyTo?.box ?? defaultBox ?? AdminEmailBox.SUPPORT,
            subject: replyTo ? `Re: ${replyTo.subject}` : "",
            htmlContent: "",
        },
    })

    const onSubmit = (values: SendEmailInput) => {
        send({ ...values, htmlContent: html }, {
            onSuccess: () => {
                form.reset()
                setHtml("")
                onSent?.()
                onClose()
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden">
                <DialogHeader className="px-6 pt-5 pb-4 border-b">
                    <DialogTitle className="text-base font-semibold">
                        {replyTo ? "Répondre" : "Nouveau message"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                        <div className="px-6 py-4 space-y-3 border-b">
                            <div className="flex gap-20">
                                <FormField
                                    control={form.control}
                                    name="fromBox"
                                    render={({ field }) => (
                                        <FormItem className="w-44 shrink-0 flex items-center gap-2">
                                            <FormLabel className="text-xs text-muted-foreground">De</FormLabel>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                disabled={!!replyTo}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="h-8 text-sm">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value={AdminEmailBox.SUPPORT}>support@infos.lency.net</SelectItem>
                                                    <SelectItem value={AdminEmailBox.DEV}>dev@infos.lency.net</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="toEmail"
                                    render={({ field }) => (
                                        <FormItem className="flex-1 flex items-center gap-2">
                                            <FormLabel className="text-xs text-muted-foreground">À</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...field}
                                                    type="email"
                                                    placeholder="destinataire@email.com"
                                                    className="h-8 text-sm"
                                                    disabled={!!replyTo}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xs text-muted-foreground">Objet</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="Objet de l'email"
                                                className="h-8 text-sm"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex-1 overflow-auto px-6 py-4">
                            <TiptapEditor
                                content={html}
                                onChange={setHtml}
                                placeholder="Rédigez votre message..."
                                minHeight="180px"
                            />
                        </div>

                        <DialogFooter className="px-6 py-4 border-t">
                            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={isPending || !html.trim() || html === "<p></p>"}>
                                <Send className="size-4 mr-2" />
                                {isPending ? "Envoi..." : "Envoyer"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
