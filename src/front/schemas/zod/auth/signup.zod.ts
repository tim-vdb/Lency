import { z } from "zod";

export const SignUpFormSchema = z
    .object({
        firstName: z.string().min(1, "The first name is required"),
        lastName: z.string().min(1, "The last name is required"),
        email: z.string().email("Email invalide"),
        password: z.string().min(12, "The password must contain at least 12 characters"),
        passwordConfirmation: z.string().min(12, "La confirmation est obligatoire"),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
        message: "The passwords do not match",
        path: ["passwordConfirmation"],
    });

export type SignUpFormValues = z.infer<typeof SignUpFormSchema>;
