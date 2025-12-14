'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { NewsletterFormSchema } from '../../server/newsletter.schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAction } from 'next-safe-action/hooks';
import { NewsletterSafeAction } from '../../server/newsletter.action';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface NewsletterProps {
  title?: string;
}

export default function Newsletter({
  title = 'Restez informés',
}: NewsletterProps) {
  const router = useRouter();
  // 1. Define your form.
  const form = useForm<z.infer<typeof NewsletterFormSchema>>({
    resolver: zodResolver(NewsletterFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const { executeAsync, hasErrored, result, hasSucceeded } = useAction(
    NewsletterSafeAction,
    {
      onSuccess: (data) => {
        toast.success('Vous êtes inscrit à la newsletter');
        form.reset();
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.error.serverError || 'Une erreur est survenue');
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
    <div className="space-y-4">
      <h3 className="text-lg">{title}</h3>
      <p>Join our newsletter to stay updated.</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="boilerplate@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full hover:cursor-pointer" type="submit">
            S'inscrire
          </Button>
        </form>
      </Form>
      {hasErrored && <p className="text-red-500">{result?.serverError}</p>}
      {/* {hasSucceeded && <p className="text-green-500">Vous êtes inscrit à la newsletter {result?.data?.name}</p>} */}
    </div>
  );
}
