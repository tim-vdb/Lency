"use client"

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { LoginFormSchema } from "../../Login/login.schema";
import { signIn } from "@/lib/auth-client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
        await signIn.email({
            email: values.email,
            password: values.password,
        }, {
            onSuccess: () => {
                toast.success("Utilisateur Connecté");
                router.push("/dashboard");
                router.refresh();
            },
            onError: (ctx) => {
                toast.error(ctx.error.serverError || "Une erreur est survenue");
            }
        })
    }

    return (
        
    <div className="dark:bg-gray-900 py-12 min-h-screen flex items-center">
  <div className="max-w-md w-full mx-auto px-6 sm:px-8 lg:px-10">
    <div className="text-center mb-8">
      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
        Connectez-vous à Mölkky !
      </h2>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
        Entrez vos informations pour continuer.
      </p>
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
              <FormLabel>Mot de Passe</FormLabel>
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
        
       
        <Button type="submit" className="w-full py-2 rounded-xl hover:bg-orange-500 transition-colors" disabled={loading}>
          Se connecter
        </Button>
      </form>
    </Form>

    <div className="w-full flex flex-col gap-3 mt-6">
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        disabled={loading}
        onClick={async () => {
          await signIn.social(
            { provider: "google", callbackURL: "/dashboard" },
            { onRequest: () => setLoading(true), onResponse: () => setLoading(false) }
          );
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
          <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"></path>
          <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"></path>
          <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"></path>
          <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"></path>
        </svg>
        Sign in with Google
      </Button>

      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        disabled={loading}
        onClick={async () => {
          await signIn.social(
            { provider: "facebook", callbackURL: "/dashboard" },
            { onRequest: () => setLoading(true), onResponse: () => setLoading(false) }
          );
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
          <path d="M20 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h8.615v-6.96h-2.338v-2.725h2.338v-2c0-2.325 1.42-3.592 3.5-3.592c.699-.002 1.399.034 2.095.107v2.42h-1.435c-1.128 0-1.348.538-1.348 1.325v1.735h2.697l-.35 2.725h-2.348V21H20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1z" fill="currentColor"></path>
        </svg>
        Sign in with Facebook
      </Button>
    </div>

    <div className="flex justify-center w-full border-t mt-6 pt-4">
      <p className="text-xs text-neutral-500">
        <Link href="/sign-up" className="underline dark:text-orange-200/90">
          Need an account?
        </Link>
      </p>
    </div>
  </div>
</div>



          
             
    );
};
