"use client"

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useState } from "react"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { signIn } from "@/lib/auth-client"

const LoginFormSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

export default function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof LoginFormSchema>>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof LoginFormSchema>) {
    setLoading(true)
    try {
      await signIn.email({
        email: values.email,
        password: values.password,
      })
      toast.success("Utilisateur connecté")
      router.push("/dashboard")
    } catch (error: any) {
      toast.error(error?.message || "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-blue-50 dark:bg-gray-800 py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Connectez-vous à Mölkky !</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">Entrez vos informations pour vous connecter.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6">

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="example@mail.com"
                      {...field}
                      className="bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500"
                    />
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
                  <FormLabel>Mot de passe</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      {...field}
                      className="bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full py-2 rounded-xl hover:bg-orange-500 transition-colors"
              disabled={loading}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : "Se connecter"}
            </Button>

          </form>
        </Form>
      </div>
    </div>
  )
}
