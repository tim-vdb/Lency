export type MessageSender = {
  id: string;
  firstname: string | null;
  lastname: string | null;
  username: string | null;
  image: string | null;
};

export type DirectMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  imageUrls: string[];
  audioUrls: string[];
  videoUrls: string[];
  createdAt: string;
  sender: MessageSender;
};

export type ConversationParticipant = {
  id: string;
  firstname: string | null;
  lastname: string | null;
  username: string | null;
  image: string | null;
};

export type Conversation = {
  id: string;
  createdAt: string;
  updatedAt: string;
  participants: ConversationParticipant[];
  messages: DirectMessage[];
};

export async function fetchConversations(): Promise<Conversation[]> {
  const res = await fetch("/api/conversations", { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur fetch conversations");
  return (await res.json()).conversations;
}

export async function getOrCreateConversation(otherUserId: string): Promise<Conversation> {
  const res = await fetch("/api/conversations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ otherUserId }),
  });
  if (!res.ok) throw new Error("Erreur création conversation");
  return (await res.json()).conversation;
}

export async function fetchConversationMessages(conversationId: string): Promise<DirectMessage[]> {
  const res = await fetch(`/api/conversations/${conversationId}/messages`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur fetch messages");
  return (await res.json()).messages;
}

export async function sendDirectMessage(
  conversationId: string,
  content: string,
  activeChatConversationId?: string | null,
  media?: { imageUrls?: string[]; audioUrls?: string[]; videoUrls?: string[] }
): Promise<DirectMessage> {
  const res = await fetch(`/api/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, activeChatConversationId, ...media }),
  });
  if (!res.ok) throw new Error("Erreur envoi message");
  return (await res.json()).message;
}
