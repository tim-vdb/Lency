import z from "zod";

export const EventsFormSchema = z.object({
    name: z.string().min(2, { message: "Le nom est requis d'au moins 2 caractères" }).max(50, { message: "Le nom ne doit pas dépasser 50 caractères" }),
    email: z.string().email(),
    phone: z.string().optional(),
    eventId: z.string().optional(),
})