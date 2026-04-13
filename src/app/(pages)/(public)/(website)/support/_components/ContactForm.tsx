// components/contact/ContactForm.tsx
"use client"

import { ContactType } from "@/back/generated/prisma_client"
import { useState } from "react"


const TYPE_LABELS: Record<ContactType, string> = {
  CONTACT_GENERAL: "Contact général",
  SUPPORT_TECHNIQUE: "Support technique",
  FACTURATION: "Facturation",
  PARTENARIAT: "Partenariat",
  AUTRE: "Autre",
}

type FormState = {
  prenom: string
  nom: string
  email: string
  sujet: string
  message: string
  type: ContactType
}

type Status = "idle" | "loading" | "success" | "error"

export default function ContactForm() {
  const [form, setForm] = useState<FormState>({
    prenom: "",
    nom: "",
    email: "",
    sujet: "",
    message: "",
    type: ContactType.CONTACT_GENERAL,
  })

  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg(null)

    try {
      const res = await fetch("/api/mails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setErrorMsg(data.error ?? "Une erreur est survenue.")
        setStatus("error")
        return
      }

      setStatus("success")
      setForm({
        prenom: "",
        nom: "",
        email: "",
        sujet: "",
        message: "",
        type: ContactType.CONTACT_GENERAL,
      })
    } catch {
      setErrorMsg("Impossible de contacter le serveur.")
      setStatus("error")
    }
  }

  if (status === "success") {
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
          onClick={() => setStatus("idle")}
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

      <form onSubmit={handleSubmit} className="space-y-5">

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="prenom" className="block text-sm text-gray-700">Prénom</label>
            <input
              id="prenom" name="prenom" value={form.prenom} onChange={handleChange}
              placeholder="Prénom" required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="nom" className="block text-sm text-gray-700">Nom</label>
            <input
              id="nom" name="nom" value={form.nom} onChange={handleChange}
              placeholder="Nom" required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm text-gray-700">Mail</label>
          <input
            id="email" name="email" type="email" value={form.email} onChange={handleChange}
            placeholder="Mail" required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="type" className="block text-sm text-gray-700">Type de demande</label>
          <select
            id="type" name="type" value={form.type} onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400 transition-colors"
          >
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="sujet" className="block text-sm text-gray-700">Sujet du message</label>
          <input
            id="sujet" name="sujet" value={form.sujet} onChange={handleChange}
            placeholder="Sujet du message" required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="message" className="block text-sm text-gray-700">Message</label>
          <textarea
            id="message" name="message" value={form.message} onChange={handleChange}
            placeholder="Message" required rows={6}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm placeholder:text-gray-300 focus:outline-none focus:border-gray-400 transition-colors resize-none"
          />
        </div>

        {status === "error" && errorMsg && (
          <p className="text-sm text-red-500">{errorMsg}</p>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-gray-400">On répond généralement sous 24 à 48h.</span>
          <button
            type="submit" disabled={status === "loading"}
            className="border border-gray-300 rounded-xl px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {status === "loading" ? "Envoi..." : "Envoyer"}
          </button>
        </div>

      </form>
    </section>
  )
}