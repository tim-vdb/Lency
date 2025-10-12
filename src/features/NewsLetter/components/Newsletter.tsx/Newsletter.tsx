"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { NewsletterFormSchema } from "../../server/newsletter.schema";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAction } from "next-safe-action/hooks";
import { NewsletterSafeAction } from "../../server/newsletter.action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface NewsletterProps {
  title?: string;
  description?: string;
}

export default function Newsletter({
  title = "Restez informés",
  description = "Inscrivez-vous à notre newsletter pour recevoir les dernières nouvelles et annonces.",
}: NewsletterProps) {
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof NewsletterFormSchema>>({
    resolver: zodResolver(NewsletterFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const { executeAsync, hasErrored, result, hasSucceeded } = useAction(
    NewsletterSafeAction,
    {
      onSuccess: (data) => {
        toast.success("Vous êtes inscrit à la newsletter");
        form.reset();
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.error.serverError || "Une erreur est survenue");
      },
    }
  );

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof NewsletterFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    await executeAsync(values);
  }

  return (
    <div className="bg-blue-50 dark:bg-gray-800 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            {description}
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom" {...field} />
                    </FormControl>
                    <FormDescription>Votre nom complet.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormDescription>Votre email.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">S'inscrire à la newsletter</Button>
            </form>
          </Form>
          {hasErrored && <p className="text-red-500">{result?.serverError}</p>}
          {/* {hasSucceeded && <p className="text-green-500">Vous êtes inscrit à la newsletter {result?.data?.name}</p>} */}
        </div>
      </div>
    </div>
  );
}
