import { ProjectMessageAction } from "@/back/repositories/project-messages.action";
import { NotificationService } from "@/back/services/notifications.service";
import { getUser } from "@/back/lib/auth-session";
import { prisma } from "@/back/lib/prisma";
import { notifyProjectMessage, notifyUserProjectMessage } from "@/back/lib/ably";
import { getDisplayName } from "@/front/lib/utils";

export const ProjectMessageService = {
  getMessages: async (projectId: string) => {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { participants: { select: { id: true } } },
    });
    if (!project) throw new Error("Not found");

    const isMember =
      project.ownerId === user.id ||
      project.participants.some((p) => p.id === user.id);
    if (!isMember) throw new Error("Forbidden");

    return ProjectMessageAction.findByProjectId(projectId);
  },

  sendMessage: async (projectId: string, content: string, media?: { imageUrls?: string[]; audioUrls?: string[]; videoUrls?: string[] }) => {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { participants: { select: { id: true } } },
    });
    if (!project) throw new Error("Not found");

    const isMember =
      project.ownerId === user.id ||
      project.participants.some((p) => p.id === user.id);
    if (!isMember) throw new Error("Forbidden");

    const message = await ProjectMessageAction.create({
      projectId,
      senderId: user.id,
      content: content.trim(),
      imageUrls: media?.imageUrls ?? [],
      audioUrls: media?.audioUrls ?? [],
      videoUrls: media?.videoUrls ?? [],
    });

    const senderName = getDisplayName(user);

    // Livraison temps réel via Ably sur le channel du chat
    await notifyProjectMessage(projectId, {
      id: message.id,
      senderId: user.id,
      senderName,
      content: message.content,
      createdAt: message.createdAt.toISOString(),
      sender: message.sender,
      imageUrls: message.imageUrls,
      audioUrls: message.audioUrls,
      videoUrls: message.videoUrls,
    });

    // Notification pour chaque membre (sauf l'expéditeur)
    const members = [
      project.ownerId,
      ...project.participants.map((p) => p.id),
    ].filter((id) => id !== user.id);

    await Promise.all(
      members.map(async (memberId) => {
        await notifyUserProjectMessage(memberId, projectId);
        const notifDescription = content.slice(0, 80) || (
          (media?.imageUrls?.length ?? 0) > 0 ? "📷 Image partagée" :
          (media?.videoUrls?.length ?? 0) > 0 ? "🎬 Vidéo partagée" :
          (media?.audioUrls?.length ?? 0) > 0 ? "🎵 Audio partagé" : "Nouveau message"
        );
        await NotificationService.upsertProjectMessageForUser(
          memberId,
          projectId,
          `${senderName} dans le chat projet`,
          notifDescription,
          { projectId, projectTitle: project.title ?? "Projet", messageId: message.id, senderId: user.id, senderName }
        );
      })
    );

    return message;
  },
};
