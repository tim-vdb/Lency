import z from 'zod';

export const ArticlesFormSchema = z.object({
  title: z.string(),
  slug: z.string(),
  content: z.string(),
  excerpt: z.string().optional(),
  image: z.string().optional(),
  published: z.boolean(),
});
