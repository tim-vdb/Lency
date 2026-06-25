"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Mail, Phone } from "lucide-react"
import { Button } from "@/front/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/front/components/ui/form"
import { Input } from "@/front/components/ui/input"
import { Textarea } from "@/front/components/ui/textarea"
import { useCreateMail } from "@/front/queries/mails"

const SupportFormSchema = z.object({
  nom: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit faire au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  telephone: z.string().optional(),
  message: z.string().min(5, "Le message doit faire au moins 5 caractères"),
})

type SupportFormValues = z.infer<typeof SupportFormSchema>


export default function ContactForm() {
  const { mutate: createMail, isPending, isSuccess, reset: resetMutation } = useCreateMail()

  const form = useForm<SupportFormValues>({
    resolver: zodResolver(SupportFormSchema),
    mode: "onBlur",
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      message: "",
    },
  })

  const onSubmit = (values: SupportFormValues) => {
    const message = values.telephone
      ? `Téléphone : ${values.telephone}\n\n${values.message}`
      : values.message

    createMail(
      {
        nom: values.nom,
        prenom: values.prenom,
        email: values.email,
        sujet: "Contact via le formulaire support",
        message,
        type: "CONTACT_GENERAL",
      },
      { onSuccess: () => form.reset() }
    )
  }

  if (isSuccess) {
    return (
      <section className="min-h-screen bg-[#FAF7F2] dark:bg-neutral-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-50 dark:bg-green-950">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-neutral-900 dark:text-white">Message envoyé !</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">On vous répond généralement sous 24 à 48h.</p>
          <button
            onClick={resetMutation}
            className="mt-4 text-sm text-neutral-400 dark:text-neutral-500 underline underline-offset-2 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
          >
            Envoyer un autre message
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#FAF7F2] dark:bg-neutral-900 px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 sm:pb-20">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

        {/* ── Colonne gauche ── */}
        <div className="flex flex-col justify-between">

          {/* Haut : titre + description */}
          <div className="flex flex-col gap-4">
            <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-black text-[#EA3D0E] uppercase leading-[1.05] tracking-tight text-left">
              Contactez notre service support
            </h1>
            <p className="text-[15px] sm:text-[16px] text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-xs">
              N&apos;hésitez pas à nous contacter si vous avez besoin d&apos;aide ou si vous avez des questions.
            </p>
          </div>

          {/* Bas : email + téléphone */}
          <div className="flex flex-col gap-3 mt-12 lg:mt-0">
            <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
              <Mail className="w-5 h-5 shrink-0" />
              <span className="text-[15px] sm:text-[16px]">support@lency.com</span>
            </div>
            <div className="flex items-center gap-3 text-neutral-700 dark:text-neutral-300">
              <Phone className="w-5 h-5 shrink-0" />
              <span className="text-[15px] sm:text-[16px]">+33 07 XX XX XX XX</span>
            </div>
          </div>
        </div>

        {/* ── Colonne droite — formulaire ── */}
        <div className="bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 p-6 sm:p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="prenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Téléphone</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} />
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
                      <Textarea rows={5} className="resize-none" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isPending}
                className="bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 text-white h-11 px-8 rounded-lg text-sm font-semibold"
              >
                {isPending ? "Envoi..." : "Envoyer"}
              </Button>

            </form>
          </Form>
        </div>

      </div>
    </section>
  )
}
