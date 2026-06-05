import { z } from "zod";
import { ContactType } from "@/back/generated/prisma_client";

export const ContactFormSchema = z.object({
    prenom: z.string().min(1, "Prénom requis"),
    nom: z.string().min(1, "Nom requis"),
    email: z.string().email("Email invalide"),
    sujet: z.string().min(1, "Sujet requis"),
    message: z.string().min(1, "Message requis"),
    type: z.nativeEnum(ContactType),
});

export type ContactFormValues = z.infer<typeof ContactFormSchema>;
