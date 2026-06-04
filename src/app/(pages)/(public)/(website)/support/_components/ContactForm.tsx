"use client"

import { ContactType } from "@/back/generated/prisma_client"
import { Button } from "@/front/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/front/components/ui/form"
import { Input } from "@/front/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/front/components/ui/select"
import { Textarea } from "@/front/components/ui/textarea"
import { useCreateMail } from "@/front/queries/mails"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"


const TYPE_LABELS: Record<ContactType, string> = {
  CONTACT_GENERAL: "Contact général",
  SUPPORT_TECHNIQUE: "Support technique",
  FACTURATION: "Facturation",
  PARTENARIAT: "Partenariat",
  AUTRE: "Autre",
}

const formSchema = z.object({
  prenom: z.string().min(1, "Prénom requis"),
  nom: z.string().min(1, "Nom requis"),
  email: z.string().email("Email invalide"),
  sujet: z.string().min(1, "Sujet requis"),
  message: z.string().min(1, "Message requis"),
  type: z.nativeEnum(ContactType),
})

type FormValues = z.infer<typeof formSchema>

export default function ContactForm() {
  const { mutate: createMail, isPending, isSuccess, reset: resetMutation } = useCreateMail()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prenom: "",
      nom: "",
      email: "",
      sujet: "",
      message: "",
      type: ContactType.CONTACT_GENERAL,
    },
  })

  const onSubmit = (values: FormValues) => {
    createMail(values, {
      onSuccess: () => form.reset(),
    })
  }

  if (isSuccess) {
    return (
      <section className="max-w-2xl mx-auto px-6 py-12 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 mb-4">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-medium text-gray-900 mb-1">Message envoyé !</h2>
        <p className="text-sm text-gray-500">On vous répond généralement sous 24 à 48h.</p>
        <button
          onClick={resetMutation}
          className="mt-6 text-sm text-gray-400 underline underline-offset-2 hover:text-gray-600 transition-colors"
        >
          Envoyer un autre message
        </button>
      </section>
    )
  }

  return (
    <section className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="font-handwriting text-4xl text-gray-900 mb-1">Besoin d'aide ?</h1>
      <p className="text-sm text-gray-500 mb-8">
        On est là pour t'aider, n'hésite pas à nous contacter.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Prénom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mail</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Mail" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type de demande</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(TYPE_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sujet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sujet du message</FormLabel>
                <FormControl>
                  <Input placeholder="Sujet du message" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea placeholder="Message" rows={6} className="resize-none" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-gray-400">On répond généralement sous 24 à 48h.</span>
            <Button type="submit" variant="outline" disabled={isPending}>
              {isPending ? "Envoi..." : "Envoyer"}
            </Button>
          </div>

        </form>
      </Form>
    </section>
  )
}