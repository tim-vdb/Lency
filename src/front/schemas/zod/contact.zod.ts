import { z } from "zod";
import { ContactType } from "@/back/generated/prisma_client";

export const ContactFormSchema = z.object({
    prenom: z.string().min(2, "Le prénom doit faire au moins 2 caractères"),
    nom: z.string().min(2, "Le nom doit faire au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    sujet: z.string().min(3, "Le sujet doit faire au moins 3 caractères"),
    message: z.string().min(5, "Le message doit faire au moins 5 caractères"),
    type: z.nativeEnum(ContactType),
});

export type ContactFormValues = z.infer<typeof ContactFormSchema>;
