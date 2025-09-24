"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { signUp } from "@/lib/auth-client"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, X } from "lucide-react"

const SignUpFormSchema = z.object({
  firstName: z.string().min(1, "Le prénom est obligatoire"),
  lastName: z.string().min(1, "Le nom est obligatoire"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  passwordConfirmation: z.string().min(6, "La confirmation est obligatoire"),
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Les mots de passe ne correspondent pas",
  path: ["passwordConfirmation"],
})

export default function SignUpForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const form = useForm<z.infer<typeof SignUpFormSchema>>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(file)
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  async function onSubmit(values: z.infer<typeof SignUpFormSchema>) {
    setLoading(true)
    try {
      await signUp.email({
        email: values.email,
        password: values.password,
        name: `${values.firstName} ${values.lastName}`,
        image: image ? await convertImageToBase64(image) : "",
        callbackURL: "/dashboard",
      })
      toast.success("Utilisateur inscrit avec succès")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error?.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dark:bg-gray-900 py-12 min-h-screen flex items-center">
      <div className="max-w-md w-full mx-auto px-6 sm:px-8 lg:px-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            S'inscrire à Mölkky !
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
            Remplissez les informations pour créer votre compte.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prénom</FormLabel>
                    <FormControl>
                      <Input placeholder="Max" {...field} className="bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Robinson" {...field} className="bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500" />
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
                    <Input type="email" placeholder="example@mail.com" {...field} className="bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mot de Passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="passwordConfirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmer le mot de passe</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-2">
              <FormLabel htmlFor="image">Photo de profil (optionnelle)</FormLabel>
              <div className="flex items-end gap-4">
                {imagePreview && (
                  <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                    <img src={imagePreview} alt="Prévisualisation" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex items-center gap-2 w-full">
                  <Input id="image" type="file" accept="image/*" onChange={handleImageChange} className="w-full" />
                  {imagePreview && <X className="cursor-pointer" onClick={() => { setImage(null); setImagePreview(null) }} />}
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full py-2 rounded-xl hover:bg-orange-500 transition-colors" disabled={loading}>
              {loading ? <Loader2 size={16} className="animate-spin" /> : "S'inscrire"}
            </Button>

          </form>
        </Form>
      </div>
    </div>
  )
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
