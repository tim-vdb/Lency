import { z } from "zod";
import { ProjectLevel, ProjectType, RemunerationType, Visibility, WorkMode, ProjectStatus } from "@/back/generated/prisma_client/edge";

const zodEnum = <T extends Record<string, string>>(e: T) =>
    z.enum(Object.values(e) as unknown as [T[keyof T], ...T[keyof T][]]);

export const createProjectSchema = z.object({
    title: z.string().min(1, "Requis"),
    description: z.string().min(1, "Requis"),
    bannerUrl: z.string().optional(),
    projectType: zodEnum(ProjectType),
    remunerationType: zodEnum(RemunerationType).optional(),
    level: zodEnum(ProjectLevel).optional(),
    workMode: zodEnum(WorkMode).optional(),
    startDate: z.string().optional(),
    roles: z.array(z.string()).optional(),
    visibility: zodEnum(Visibility).optional(),
    city: z.string().max(255).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
});

export const updateProjectSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    status: zodEnum(ProjectStatus).optional(),
    bannerUrl: z.string().optional(),
    projectType: zodEnum(ProjectType).optional(),
    remunerationType: zodEnum(RemunerationType).optional(),
    level: zodEnum(ProjectLevel).optional(),
    workMode: zodEnum(WorkMode).optional(),
    startDate: z.string().optional(),
    roles: z.array(z.string()).optional(),
    visibility: zodEnum(Visibility).optional(),
    city: z.string().max(255).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
}).refine(data => Object.keys(data).length > 0, { message: "Aucune donnée à mettre à jour" });

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;