import { z } from "zod";

export const createApplicationSchema = z.object({
    applicantNote: z.string().optional(),
    portfolioUrl: z.string().url().optional().or(z.literal("")),
    cvUrl: z.string().url().optional().or(z.literal("")),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
