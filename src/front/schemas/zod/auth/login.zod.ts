import { z } from 'zod';

export const LoginFormSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "The password must contain at least 6 characters."),
});

export type LoginFormValues = z.infer<typeof LoginFormSchema>;
