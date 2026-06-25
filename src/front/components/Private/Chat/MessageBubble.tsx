"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { getDisplayName, getInitialName } from "@/front/lib/utils";
import { MediaImage } from "./MediaImage";

type Sender = {
  id: string;
  firstname: string | null;
  lastname: string | null;
  username: string | null;
  image: string | null;
};

interface MessageBubbleProps {
  content: string;
  createdAt: string;
  sender: Sender;
  isMe: boolean;
  imageUrls?: string[];
  audioUrls?: string[];
  videoUrls?: string[];
}

export function MessageBubble({ content, createdAt, sender, isMe, imageUrls = [], audioUrls = [], videoUrls = [] }: MessageBubbleProps) {
  const time = new Date(createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const hasMedia = imageUrls.length > 0 || audioUrls.length > 0 || videoUrls.length > 0;

  return (
    <div className={`flex gap-2 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
      {!isMe && (
        <Avatar className="h-7 w-7 shrink-0 mt-1">
          <AvatarImage src={sender.image ?? undefined} />
          <AvatarFallback className="text-[10px]">{getInitialName(sender)}</AvatarFallback>
        </Avatar>
      )}
      <div className={`flex flex-col gap-0.5 max-w-[70%] ${isMe ? "items-end" : "items-start"}`}>
        {!isMe && (
          <span className="text-[11px] text-neutral-400 px-1">{getDisplayName(sender)}</span>
        )}

        {/* Bulle texte */}
        {content && (
          <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${isMe
            ? "bg-[#ffeae5] text-white rounded-tr-sm"
            : "bg-[#f5f5f5] text-neutral-900 rounded-tl-sm"
            }`}>
            {content}
          </div>
        )}

        {/* Médias */}
        {hasMedia && (
          <div className="flex flex-col gap-2 mt-1 w-full">
            {imageUrls.length > 0 && (
              <div className={`grid gap-1 ${imageUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                {imageUrls.map((url, i) => (
                  <MediaImage key={i} url={url} />
                ))}
              </div>
            )}
            {videoUrls.map((url, i) => (
              <video key={i} src={url} controls
                className="rounded-xl max-h-64 w-full border border-neutral-200" />
            ))}
            {audioUrls.map((url, i) => (
              <audio key={i} src={url} controls className="w-full min-w-60 max-w-60" />
            ))}
          </div>
        )}

        <span className="text-[10px] text-neutral-400 px-1">{time}</span>
      </div>
    </div>
  );
}
