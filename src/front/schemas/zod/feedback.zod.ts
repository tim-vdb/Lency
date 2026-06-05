import { z } from "zod";

export const CreateFeedbackSchema = z.object({
    description: z.string().min(10, "Décris le feedback en au moins 10 caractères."),
    imageUrl: z.string().nullable().optional(),
});

export type CreateFeedbackFormValues = z.infer<typeof CreateFeedbackSchema>;
