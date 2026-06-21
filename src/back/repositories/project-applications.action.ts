import { prisma } from "@/back/lib/prisma";

export const ProjectApplicationAction = {
  // Créer une candidature
  create: (data: { projectId: string; userId: string; applicantNote?: string; portfolioUrl?: string; cvUrl?: string }) =>
    prisma.projectApplication.create({ data }),

  // Récupérer une candidature par ID avec profil complet
  findById: (id: string) =>
    prisma.projectApplication.findUnique({
      where: { id },
      include: {
        user: { include: { configs: true } },
        project: true,
      },
    }),

  // Récupérer les candidatures d'un projet avec profil complet des candidats
  findByProjectId: (projectId: string) =>
    prisma.projectApplication.findMany({
      where: { projectId },
      include: {
        user: {
          include: {
            configs: true,
            socialLinks: true,
            categoryFollows: { include: { category: true } },
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    }),

  // Récupérer les candidatures d'un utilisateur
  findByUserId: (userId: string) =>
    prisma.projectApplication.findMany({
      where: { userId },
      include: { project: true },
      orderBy: { appliedAt: "desc" },
    }),

  // Vérifier si un utilisateur a déjà candidaté
  findByProjectAndUser: (projectId: string, userId: string) =>
    prisma.projectApplication.findUnique({
      where: { projectId_userId: { projectId, userId } },
    }),

  // Mettre à jour le statut (+ note optionnelle du owner)
  updateStatus: (
    id: string,
    status: "PENDING" | "ACCEPTED" | "REJECTED",
    ownerNote?: string
  ) =>
    prisma.projectApplication.update({
      where: { id },
      data: { status, respondedAt: new Date(), ...(ownerNote !== undefined && { ownerNote }) },
      include: { user: true, project: true },
    }),

  // Supprimer une candidature
  delete: (id: string) => prisma.projectApplication.delete({ where: { id } }),
};
