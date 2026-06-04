"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/front/context/UserContext";
import { useAblyClient } from "@/front/context/AblyContext";
import { useActiveChat } from "@/front/context/ActiveChatContext";
import { useProjectMessages, useSendProjectMessage, projectMessageQueries } from "@/front/hooks/queries/use-project-messages";
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { getDisplayName, getInitialName } from "@/front/lib/utils";
import { ChatInput, type ChatMedia } from "@/front/components/Private/Chat/ChatInput";
import type { ProjectMessage } from "@/front/lib/api/project-messages";
import Image from "next/image";
import Link from "next/link";

interface ProjectChatProps {
  projectId: string;
}

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "à l'instant";
  if (diffMins < 60) return `il y a ${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `il y a ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `il y a ${diffDays} j`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}

export function ProjectChat({ projectId }: ProjectChatProps) {
  const user = useUser();
  const ablyClient = useAblyClient();
  const queryClient = useQueryClient();
  const { setActiveProjectChat } = useActiveChat();
  const { data: messages = [], isLoading } = useProjectMessages(projectId);
  const { mutate: sendMessage, isPending } = useSendProjectMessage(projectId);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveProjectChat(projectId);
    return () => setActiveProjectChat(null);
  }, [projectId, setActiveProjectChat]);

  useEffect(() => {
    if (!user?.id || !ablyClient) return;
    const channel = ablyClient.channels.get(`project-chat-${projectId}`);
    const listKey = projectMessageQueries.list(projectId).queryKey;

    channel.subscribe("new_message", (msg) => {
      const incoming = msg.data as ProjectMessage;
      if (incoming.senderId === user.id) return;
      queryClient.setQueryData<ProjectMessage[]>(listKey, (old = []) => {
        const exists = old.some((m) => m.id === incoming.id);
        return exists ? old : [...old, incoming];
      });
    });

    return () => {
      channel.unsubscribe();
    };
  }, [projectId, user?.id, ablyClient, queryClient]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend(content: string, media: ChatMedia) {
    sendMessage({ content, ...media });
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-3">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-neutral-200" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2">
            <p className="text-sm text-gray">Aucun message pour l'instant. Démarrez la conversation !</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ProjectMessageBubble
              key={msg.id}
              message={msg}
              isMe={msg.senderId === user?.id || msg.senderId === "me"}
            />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input avec support médias */}
      <ChatInput onSend={handleSend} isPending={isPending} placeholder="Envoyer un message" />
    </div>
  );
}

// ─── Bulle de message projet ──────────────────────────────────────────────────

function ProjectMessageBubble({ message, isMe }: { message: ProjectMessage; isMe: boolean }) {
  const time = formatRelativeTime(message.createdAt);
  const { sender } = message;
  const hasMedia = (message.imageUrls?.length ?? 0) > 0 || (message.audioUrls?.length ?? 0) > 0 || (message.videoUrls?.length ?? 0) > 0;

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[65%] px-4 pt-3 pb-4 ${isMe
          ? "bg-[#ffeae5] rounded-tl-xl rounded-tr-xl rounded-bl-xl"
          : "bg-[#f5f5f5] rounded-tl-xl rounded-tr-xl rounded-br-xl"
          }`}
      >
        {/* Header : avatar + nom + séparateur + heure */}
        <div className="flex items-center gap-2 mb-2">
          <Link href={`/user/${sender.username}`}>
            <Avatar className="h-[26px] w-[26px] shrink-0">
              <AvatarImage src={sender.image ?? undefined} />
              <AvatarFallback className="text-[9px]">{getInitialName(sender)}</AvatarFallback>
            </Avatar>
          </Link>
          <span className="text-sm text-[#4c4a43] truncate">{getDisplayName(sender)}</span>
          <span className="h-1 w-1 rounded-full shrink-0 bg-gray" />
          <span className={`text-[11px] shrink-0 ${isMe ? "text-[#4c4a43]" : "text-gray"}`}>{time}</span>
        </div>

        {/* Contenu texte */}
        {message.content && (
          <p className="text-base text-black leading-6">{message.content}</p>
        )}

        {/* Médias */}
        {hasMedia && (
          <div className="flex flex-col gap-2 mt-2">
            {message.imageUrls?.length > 0 && (
              <div className={`grid gap-1 ${message.imageUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                {message.imageUrls.map((url, i) => (
                  <Image key={i} src={url} alt="" width={400} height={192} style={{ height: "auto" }} className="rounded-lg max-h-48 w-full object-cover cursor-zoom-in" />
                ))}
              </div>
            )}
            {message.videoUrls?.map((url, i) => (
              <video key={i} src={url} controls className="rounded-lg max-h-48 w-full" />
            ))}
            {message.audioUrls?.map((url, i) => (
              <audio key={i} src={url} controls className="w-full" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
