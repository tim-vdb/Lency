import { prisma } from "@/back/lib/prisma";
import { Prisma } from "@/back/generated/prisma_client";

export const NotificationAction = {
  create: (data: Prisma.NotificationCreateInput) =>
    prisma.notification.create({ data }),

  findByUserId: (userId: string, onlyUnread = false) =>
    prisma.notification.findMany({
      where: { userId, ...(onlyUnread ? { read: false } : {}) },
      orderBy: { createdAt: "desc" },
      take: 50,
    }),

  // Upsert for DM notifications: one unread notification per conversation
  upsertDM: async (
    userId: string,
    conversationId: string,
    title: string,
    description: string,
    data: Prisma.InputJsonValue
  ) => {
    const existing = await prisma.notification.findFirst({
      where: {
        userId,
        type: "dm_message",
        read: false,
        data: { path: ["conversationId"], equals: conversationId },
      },
    });

    if (existing) {
      return prisma.notification.update({
        where: { id: existing.id },
        data: { title, description, data, read: false, createdAt: new Date() },
      });
    }

    return prisma.notification.create({
      data: {
        user: { connect: { id: userId } },
        type: "dm_message",
        title,
        description,
        data,
      },
    });
  },

  // Une seule notif non-lue par projet — met à jour si elle existe déjà
  upsertProjectMessage: async (
    userId: string,
    projectId: string,
    title: string,
    description: string,
    data: Prisma.InputJsonValue
  ) => {
    const existing = await prisma.notification.findFirst({
      where: {
        userId,
        type: "project_message",
        read: false,
        data: { path: ["projectId"], equals: projectId },
      },
    });
    if (existing) {
      return prisma.notification.update({
        where: { id: existing.id },
        data: { title, description, data, read: false, createdAt: new Date() },
      });
    }
    return prisma.notification.create({
      data: {
        user: { connect: { id: userId } },
        type: "project_message",
        title,
        description,
        data,
      },
    });
  },

  findUnreadComment: (userId: string, type: string, entityIdField: string, entityId: string) =>
    prisma.notification.findFirst({
      where: {
        userId,
        type,
        read: false,
        data: { path: [entityIdField], equals: entityId },
      },
    }),

  updateNotification: (id: string, data: Prisma.NotificationUpdateInput) =>
    prisma.notification.update({ where: { id }, data }),

  deleteByApplicationId: (userId: string, applicationId: string) =>
    prisma.notification.deleteMany({
      where: {
        userId,
        type: "new_application",
        data: { path: ["applicationId"], equals: applicationId },
      },
    }),

  markAsRead: (id: string) =>
    prisma.notification.update({ where: { id }, data: { read: true } }),

  markAllAsRead: (userId: string) =>
    prisma.notification.updateMany({ where: { userId, read: false }, data: { read: true } }),

  delete: (id: string) =>
    prisma.notification.delete({ where: { id } }),
};
