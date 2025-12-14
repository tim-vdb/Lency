'use client';

import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { FormItem } from '@/components/ui/form';
import { FormLabel } from '@/components/ui/form';
import { FormControl } from '@/components/ui/form';
import { FormDescription } from '@/components/ui/form';
import { FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAction } from 'next-safe-action/hooks';
import React from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/ui/DatePicker';
import { DatePickerRange } from '@/components/ui/DatePickerRange';
import { UploadButton } from '@/lib/uploadthing';
import { ArticlesFormSchema } from '../articles.schema';
import { ArticlesSafeAction } from '../articles.action';

export default function FormCreateArticles() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = React.useState<string>('');

  // 1. Define your form.
  const form = useForm<z.infer<typeof ArticlesFormSchema>>({
    resolver: zodResolver(ArticlesFormSchema),
    defaultValues: {
      title: '',
      content: '',
      excerpt: '',
      image: '',
      slug: '',
      published: false,
    },
  });

  const { executeAsync, hasErrored, result, hasSucceeded } = useAction(
    ArticlesSafeAction,
    {
      onSuccess: (data) => {
        toast.success('Article créé avec succès !');
        form.reset();
        setImageUrl(''); // Réinitialiser l'URL de l'image
        // Forcer le rafraîchissement de la page
        router.refresh();
      },
      onError: (error) => {
        console.error("Erreur lors de la création de l'article:", error);
        toast.error(
          error.error.serverError ||
            "Une erreur est survenue lors de la création de l'article"
        );
      },
    }
  );

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof ArticlesFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    // console.log(values);
    await executeAsync(values);
  }

  return (
    <div className="container flex justify-center items-center">
      <Card>
        <CardHeader>
          <CardTitle>Créer un article</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex items-center flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Titre</FormLabel>
                      <FormControl>
                        <Input placeholder="Mon titre" {...field} />
                      </FormControl>
                      <FormDescription>Titre de l'article.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contenu</FormLabel>
                      <FormControl>
                        <Input placeholder="Contenu" {...field} />
                      </FormControl>
                      <FormDescription>Contenu de l'article.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="excerpt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Extrait</FormLabel>
                    <FormControl>
                      <Input placeholder="Extrait" {...field} />
                    </FormControl>
                    <FormDescription>Extrait de l'article.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center flex-col md:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="a-b-c" {...field} />
                      </FormControl>
                      <FormDescription>Slug de l'article</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Publier</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        Publier l'article après informations remplis.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col gap-2">
                <UploadButton
                  endpoint="ArticleUploader"
                  onClientUploadComplete={(res) => {
                    console.log('Files: ', res);
                    if (res && res[0]) {
                      const uploadedUrl = res[0].ufsUrl;
                      setImageUrl(uploadedUrl);
                      // Met à jour le champ image dans le formulaire
                      form.setValue('image', uploadedUrl);
                      toast.success('Image uploadée avec succès !');
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast.error(`Erreur d'upload: ${error.message}`);
                  }}
                  className="mb-4 bg-blue-600 ut-allowed-content:text-white text-white px-4 py-2 rounded-lg transition-colors [&_label]:w-full [&_label]:hover:bg-blue-500 "
                />
                {imageUrl && (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <span>✓ Image uploadée</span>
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        form.setValue('image', '');
                      }}
                      className="text-red-500 hover:underline"
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>

              <Button type="submit">Créer l'article</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
