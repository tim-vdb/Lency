import { prisma } from "@/back/lib/prisma";

export const ProjectMessageAction = {
  findByProjectId: (projectId: string, limit = 50) =>
    prisma.projectMessage.findMany({
      where: { projectId },
      include: { sender: { select: { id: true, firstname: true, lastname: true, username: true, image: true } } },
      orderBy: { createdAt: "asc" },
      take: limit,
    }),

  create: (data: { projectId: string; senderId: string; content: string; imageUrls?: string[]; audioUrls?: string[]; videoUrls?: string[] }) =>
    prisma.projectMessage.create({
      data,
      include: { sender: { select: { id: true, firstname: true, lastname: true, username: true, image: true } } },
    }),
};
