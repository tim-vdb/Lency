import { z } from "zod";
import { ProjectLevel, ProjectType, RemunerationType, Visibility, WorkMode } from "@/back/generated/prisma_client/edge";
import { zodEnum } from "@/front/lib/utils";

export const CreateProjectSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(150, "Maximum 150 caractères"),
    description: z.string().min(1, "La description est requise").max(2000, "Maximum 2000 caractères"),
    projectType: zodEnum(ProjectType, { message: "Le type de projet est requis" }),
    level: zodEnum(ProjectLevel).optional(),
    remunerationType: zodEnum(RemunerationType).optional(),
    workMode: zodEnum(WorkMode).optional(),
    visibility: zodEnum(Visibility),
    city: z.string().max(255).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    startDate: z.string().optional(),
    bannerUrl: z.string().optional(),
    roles: z.array(z.string()),
    isPublished: z.boolean(),
});

export type CreateProjectValues = z.infer<typeof CreateProjectSchema>;

export const EditProjectSchema = z.object({
    title: z.string().min(1, "Le titre est requis").max(150, "Maximum 150 caractères"),
    description: z.string().min(1, "La description est requise").max(2000, "Maximum 2000 caractères"),
    projectType: zodEnum(ProjectType).optional(),
    level: zodEnum(ProjectLevel).optional(),
    remunerationType: zodEnum(RemunerationType).optional(),
    workMode: zodEnum(WorkMode).optional(),
    city: z.string().max(255).optional(),
    startDate: z.string().optional(),
    visibility: zodEnum(Visibility),
    bannerUrl: z.string().optional(),
    roles: z.array(z.string()),
});

export type EditProjectValues = z.infer<typeof EditProjectSchema>;