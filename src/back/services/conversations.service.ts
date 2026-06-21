import { ConversationAction } from "@/back/repositories/conversations.action";
import { NotificationService } from "@/back/services/notifications.service";
import { getUser } from "@/back/lib/auth-session";
import { notifyDirectMessage } from "@/back/lib/ably";
import { getDisplayName } from "@/front/lib/utils";

export const ConversationService = {
  getMyConversations: async () => {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    const conversations = await ConversationAction.findByUserId(user.id);

    // Déduplique : garde une seule conversation par paire d'utilisateurs (la plus récente)
    const seen = new Map<string, typeof conversations[0]>();
    for (const conv of conversations) {
      const other = conv.participants.find((p) => p.id !== user.id);
      if (!other) continue;
      const existing = seen.get(other.id);
      if (!existing || conv.updatedAt > existing.updatedAt) {
        seen.set(other.id, conv);
      }
    }
    return Array.from(seen.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  getOrCreateConversation: async (otherUserId: string) => {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");
    if (user.id === otherUserId) throw new Error("Cannot DM yourself");

    const existing = await ConversationAction.findByParticipants(user.id, otherUserId);
    if (existing) return existing;

    return ConversationAction.create(user.id, otherUserId);
  },

  getMessages: async (conversationId: string) => {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const conversation = await ConversationAction.findById(conversationId);
    if (!conversation) throw new Error("Not found");

    const isMember = conversation.participants.some((p) => p.id === user.id);
    if (!isMember) throw new Error("Forbidden");

    return ConversationAction.findMessages(conversationId);
  },

  sendMessage: async (
    conversationId: string,
    content: string,
    activeChatConversationId?: string | null,
    media?: { imageUrls?: string[]; audioUrls?: string[]; videoUrls?: string[] }
  ) => {
    const user = await getUser();
    if (!user) throw new Error("Unauthorized");

    const conversation = await ConversationAction.findById(conversationId);
    if (!conversation) throw new Error("Not found");

    const isMember = conversation.participants.some((p) => p.id === user.id);
    if (!isMember) throw new Error("Forbidden");

    const [message] = await ConversationAction.createMessage({
      conversationId,
      senderId: user.id,
      content: content.trim(),
      imageUrls: media?.imageUrls ?? [],
      audioUrls: media?.audioUrls ?? [],
      videoUrls: media?.videoUrls ?? [],
    });

    const senderName = getDisplayName(user);

    // Livrer en temps réel + créer une notification pour le destinataire (si pas dans la conv)
    const recipients = conversation.participants.filter((p) => p.id !== user.id);

    await Promise.all(
      recipients.map(async (recipient) => {
        await notifyDirectMessage(recipient.id, {
          id: message.id,
          conversationId,
          senderId: user.id,
          senderName,
          content: message.content,
          createdAt: message.createdAt.toISOString(),
          sender: message.sender,
          imageUrls: message.imageUrls,
          audioUrls: message.audioUrls,
          videoUrls: message.videoUrls,
        });

        // Une seule notif non-lue par conversation — mise à jour si elle existe déjà
        if (activeChatConversationId !== conversationId) {
          await NotificationService.upsertDMForUser(
            recipient.id,
            conversationId,
            `Message de ${senderName}`,
            content.slice(0, 80),
            { conversationId, messageId: message.id, senderId: user.id, senderName }
          );
        }
      })
    );

    return message;
  },
};
