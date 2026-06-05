import { NotificationAction } from "@/back/repositories/notifications.action";
import { getUser } from "@/back/lib/auth-session";
import { Prisma } from "@/back/generated/prisma_client";


export const NotificationService = {
  getMyNotifications: async () => {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    return NotificationAction.findByUserId(user.id);
  },

  markAsRead: async (id: string) => {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    return NotificationAction.markAsRead(id);
  },

  dismiss: async (id: string) => {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    return NotificationAction.delete(id);
  },

  // Appelé depuis d'autres services (pas de getUser ici — ownerId passé explicitement)
  createForUser: (
    userId: string,
    type: string,
    title: string,
    description: string,
    data: Prisma.InputJsonValue
  ) =>
    NotificationAction.create({
      user: { connect: { id: userId } },
      type,
      title,
      description,
      data,
    }),

  // Upsert for comment notifications: groups multiple comments on the same entity into one unread notif
  upsertCommentForUser: async (
    userId: string,
    type: string,
    entityIdField: string,
    entityId: string,
    makeNotif: (count: number) => { title: string; description: string; data: Prisma.InputJsonValue }
  ) => {
    const existing = await NotificationAction.findUnreadComment(userId, type, entityIdField, entityId);
    const currentCount = existing
      ? ((existing.data as Record<string, unknown>).count as number | undefined) ?? 1
      : 0;
    const newCount = currentCount + 1;
    const notif = makeNotif(newCount);

    if (existing) {
      return NotificationAction.updateNotification(existing.id, {
        title: notif.title,
        description: notif.description,
        data: notif.data,
        createdAt: new Date(),
      });
    }
    return NotificationAction.create({
      user: { connect: { id: userId } },
      type,
      title: notif.title,
      description: notif.description,
      data: notif.data,
    });
  },

  dismissApplicationNotification: (userId: string, applicationId: string) =>
    NotificationAction.deleteByApplicationId(userId, applicationId),

  upsertProjectMessageForUser: (
    userId: string,
    projectId: string,
    title: string,
    description: string,
    data: Prisma.InputJsonValue
  ) => NotificationAction.upsertProjectMessage(userId, projectId, title, description, data),

  // Une seule notif non-lue par conversation DM — met à jour si elle existe déjà
  upsertDMForUser: (
    userId: string,
    conversationId: string,
    title: string,
    description: string,
    data: Prisma.InputJsonValue
  ) => NotificationAction.upsertDM(userId, conversationId, title, description, data),
};
