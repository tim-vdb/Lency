import { z } from "zod";

export const projectApplicationStatusSchema = z.enum([
  "PENDING",
  "ACCEPTED",
  "REJECTED",
]);

export const projectApplicationSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  userId: z.string(),
  status: projectApplicationStatusSchema,
  appliedAt: z.coerce.date(),
  respondedAt: z.coerce.date().nullable(),
  user: z.object({
    id: z.string(),
    firstname: z.string().nullable(),
    lastname: z.string().nullable(),
    username: z.string().nullable(),
    image: z.string().nullable(),
    email: z.string(),
  }),
  project: z.object({
    id: z.string(),
    title: z.string(),
  }),
});

export type ProjectApplication = z.infer<typeof projectApplicationSchema>;
export type ProjectApplicationStatus = z.infer<
  typeof projectApplicationStatusSchema
>;

export const ApplyToProjectSchema = z.object({
    applicantNote: z.string().max(1000, "Maximum 1000 caractères").optional(),
    portfolioUrl: z.string().url("URL invalide").optional().or(z.literal("")),
    cvUrl: z.string().url("URL invalide").optional().or(z.literal("")),
});

export type ApplyToProjectFormValues = z.infer<typeof ApplyToProjectSchema>;
