import { z } from "zod";

export const createProjectSchema = z.object({
    title: z.string().min(1, "Requis"),
    description: z.string().min(1, "Requis"),
    bannerUrl: z.string().optional(),
    projectType: z.enum(["COURT_METRAGE", "LONG_METRAGE", "SERIE", "CLIP", "DOCUMENTAIRE", "YOUTUBE", "AUTRE"]),
    remunerationType: z.enum(["NON_REMUNERE", "REMUNERE"]).optional(),
    level: z.enum(["DEBUTANT", "INTERMEDIAIRE", "AVANCE"]).optional(),
    workMode: z.enum(["PRESENTIEL", "DISTANCIEL", "HYBRIDE"]).optional(),
    startDate: z.string().optional(),
    roles: z.array(z.string()).optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE", "MEMBERS_ONLY"]).optional(),
    city: z.string().optional(),
    status: z.enum(["PUBLISHED", "DRAFT"]).optional(),
});

export const updateProjectSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    status: z.enum(["PUBLISHED", "DRAFT", "ARCHIVED"]).optional(),
    bannerUrl: z.string().optional(),
    projectType: z.string().optional(),
    remunerationType: z.enum(["NON_REMUNERE", "REMUNERE"]).optional(),
    level: z.enum(["DEBUTANT", "INTERMEDIAIRE", "AVANCE"]).optional(),
    workMode: z.enum(["PRESENTIEL", "DISTANCIEL", "HYBRIDE"]).optional(),
    startDate: z.string().optional(),
    roles: z.array(z.string()).optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE", "MEMBERS_ONLY"]).optional(),
    city: z.string().optional(),
}).refine(data => Object.keys(data).length > 0, { message: "Aucune donnée à mettre à jour" });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
