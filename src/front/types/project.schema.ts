import { Prisma } from "@/back/generated/prisma_client";
import { z } from "zod";

// ─── Types Prisma (réponses API) ──────────────────────────────────────────────

export type Project = Prisma.ProjectGetPayload<{}>;

export type ProjectWithMapLocation = Prisma.ProjectGetPayload<{
    include: { mapLocation: true };
}>;

export type ProjectWithOwner = Prisma.ProjectGetPayload<{
    include: { owner: true };
}>;

export type ProjectFull = Prisma.ProjectGetPayload<{
    include: { mapLocation: true; owner: true; participants: true };
}>;

// ─── Schémas Zod (validation des formulaires) ─────────────────────────────────

export const MapLocationSchema = z.object({
    name: z.string().min(1, "Le nom du lieu est requis"),
    latitude: z.number(),
    longitude: z.number(),
    description: z.string().optional(),
})

export const CreateProjectSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(100, "Le titre ne doit pas dépasser 100 caractères"),
    description: z.string().min(1, "La description est requise"),
    mapLocation: MapLocationSchema.optional(),
})

export const UpdateProjectSchema = CreateProjectSchema.partial().extend({
    status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).optional(),
})

export type CreateProjectFormValues = z.infer<typeof CreateProjectSchema>
export type UpdateProjectFormValues = z.infer<typeof UpdateProjectSchema>