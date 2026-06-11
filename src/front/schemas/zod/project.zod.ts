import { z } from "zod";

export const CreateProjectSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(150, "Maximum 150 caractères"),
    description: z.string().min(1, "La description est requise").max(2000, "Maximum 2000 caractères"),
    projectType: z.enum(["COURT_METRAGE", "LONG_METRAGE", "SERIE", "CLIP", "DOCUMENTAIRE", "YOUTUBE", "AUTRE"], { required_error: "Le type de projet est requis" }),
    level: z.enum(["DEBUTANT", "INTERMEDIAIRE", "AVANCE"]).optional(),
    remunerationType: z.enum(["NON_REMUNERE", "REMUNERE"]).optional(),
    workMode: z.enum(["PRESENTIEL", "DISTANCIEL", "HYBRIDE"]).optional(),
    city: z.string().max(100).optional(),
    startDate: z.string().optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    bannerUrl: z.string().optional(),
    roles: z.array(z.string()),
    isPublished: z.boolean(),
});

export type CreateProjectValues = z.infer<typeof CreateProjectSchema>;

export const EditProjectSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(150, "Maximum 150 caractères"),
    description: z.string().min(1, "La description est requise").max(2000, "Maximum 2000 caractères"),
    projectType: z.enum(["COURT_METRAGE", "LONG_METRAGE", "SERIE", "CLIP", "DOCUMENTAIRE", "YOUTUBE", "AUTRE"]).optional(),
    level: z.enum(["DEBUTANT", "INTERMEDIAIRE", "AVANCE"]).optional(),
    remunerationType: z.enum(["NON_REMUNERE", "REMUNERE"]).optional(),
    workMode: z.enum(["PRESENTIEL", "DISTANCIEL", "HYBRIDE"]).optional(),
    city: z.string().max(100).optional(),
    startDate: z.string().optional(),
    visibility: z.enum(["PUBLIC", "PRIVATE"]),
    bannerUrl: z.string().optional(),
    roles: z.array(z.string()),
});

export type EditProjectValues = z.infer<typeof EditProjectSchema>;
