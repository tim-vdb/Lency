"use client";

import { useEffect, useRef, useState } from "react";
import * as Ably from "ably";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/front/states/contexts/user.context";
import { useActiveChat } from "@/front/states/contexts/active-chat.context";
import {
  useConversationMessages,
  useSendDirectMessage,
  useGetOrCreateConversation,
  conversationQueries,
} from "@/front/queries/conversations";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { getDisplayName, getInitialName } from "@/front/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/front/components/ui/dialog";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { DirectMessage, ConversationParticipant } from "@/front/lib/api/conversations";

interface DirectMessageChatProps {
  otherUser: ConversationParticipant;
  onClose: () => void;
}

export function DirectMessageChat({ otherUser, onClose }: DirectMessageChatProps) {
  const user = useUser();
  const queryClient = useQueryClient();
  const { setActiveDMConversation } = useActiveChat();
  const { mutate: getOrCreate } = useGetOrCreateConversation();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Créer ou récupérer la conversation
  useEffect(() => {
    getOrCreate(otherUser.id, {
      onSuccess: (conv) => setConversationId(conv.id),
    });
  }, [otherUser.id, getOrCreate]);

  // Marquer cette conversation comme active
  useEffect(() => {
    if (!conversationId) return;
    setActiveDMConversation(conversationId);
    return () => setActiveDMConversation(null);
  }, [conversationId, setActiveDMConversation]);

  const { data: messages = [], isLoading } = useConversationMessages(conversationId ?? "");
  const { mutate: sendMessage, isPending } = useSendDirectMessage(conversationId ?? "");

  // Subscribe Ably en temps réel
  useEffect(() => {
    if (!user?.id || !conversationId) return;

    const client = new Ably.Realtime({ authUrl: "/api/ably/token" });
    const channel = client.channels.get(`user-dms-${user.id}`);
    const listKey = conversationQueries.messages(conversationId).queryKey;

    channel.subscribe("new_message", (msg) => {
      const incoming = msg.data as DirectMessage;
      if (incoming.conversationId !== conversationId) return;
      if (incoming.senderId === user.id) return;
      queryClient.setQueryData<DirectMessage[]>(listKey, (old = []) => {
        const exists = old.some((m) => m.id === incoming.id);
        return exists ? old : [...old, incoming];
      });
    });

    return () => { client.close(); };
  }, [conversationId, user?.id, queryClient]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-[440px] p-0 gap-0 overflow-hidden h-[600px] flex flex-col">
        <DialogHeader className="px-4 py-3 border-b border-neutral-200 bg-neutral-50 flex-shrink-0">
          <div className="flex items-center gap-3">
            <Link href={`/user/${otherUser.username}`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={otherUser.image ?? undefined} />
                <AvatarFallback className="text-xs">{getInitialName(otherUser)}</AvatarFallback>
              </Avatar>
            </Link>
            <div className="flex items-center gap-2 min-w-0">
              <DialogTitle className="text-sm font-semibold truncate">
                {getDisplayName(otherUser)}
              </DialogTitle>
              {otherUser.username && (
                <Link
                  href={`/user/${otherUser.username}`}
                  onClick={onClose}
                  className="text-neutral-400 hover:text-neutral-600 transition-colors shrink-0"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        </DialogHeader>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {isLoading || !conversationId ? (
            <div className="flex items-center justify-center h-full">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-300 border-t-orange" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-neutral-400">
              <p className="text-sm">Démarrez la conversation !</p>
            </div>
          ) : (
            messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                content={msg.content}
                createdAt={msg.createdAt}
                sender={msg.sender}
                isMe={msg.senderId === user?.id || msg.senderId === "me"}
                imageUrls={msg.imageUrls}
                audioUrls={msg.audioUrls}
                videoUrls={msg.videoUrls}
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        <ChatInput
          onSend={(content, media) => sendMessage({ content, ...media })}
          isPending={isPending || !conversationId}
        />
      </DialogContent>
    </Dialog>
  );
}
