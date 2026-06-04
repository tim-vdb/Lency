import { MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/front/components/ui/avatar";
import { getDisplayName, getInitialName } from "@/front/lib/utils";
import type { DBNotification } from "@/front/hooks/queries/use-notifications";
import type { ConversationParticipant } from "@/front/lib/api/conversations";
import { EmptyState } from "./EmptyState";
import { formatDate } from "./utils";
import type { Conversation } from "./types";
import Link from "next/link";

interface ConversationsListProps {
    conversations: Conversation[];
    currentUserId?: string;
    dmNotifications: DBNotification[];
    onOpenChat: (user: ConversationParticipant) => void;
    onDismissNotif: (id: string) => void;
}

export function ConversationsList({
    conversations,
    currentUserId,
    dmNotifications,
    onOpenChat,
    onDismissNotif,
}: ConversationsListProps) {
    if (conversations.length === 0) {
        return (
            <EmptyState
                icon={<MessageCircle className="w-12 h-12 text-neutral-200" />}
                message="Aucune conversation pour le moment"
            />
        );
    }

    return (
        <div className="flex flex-col gap-1">
            {conversations.map((conv) => {
                const other = conv.participants.find(p => p.id !== currentUserId) ?? conv.participants[0];
                const lastMsg = conv.messages[0];
                const unreadNotif = dmNotifications.find(
                    n => (n.data as Record<string, unknown>)?.conversationId === conv.id
                );
                const hasUnread = !!unreadNotif;

                return (
                    <button
                        key={conv.id}
                        onClick={() => {
                            onOpenChat(other);
                            if (unreadNotif) onDismissNotif(unreadNotif.id);
                        }}
                        className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left w-full cursor-pointer ${hasUnread ? "bg-neutral-100 hover:bg-neutral-200" : "hover:bg-neutral-100"
                            }`}
                    >
                        <div className="relative shrink-0">
                            <Link href={`/user/${other.username}`} target="_blank">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={other.image ?? undefined} />
                                    <AvatarFallback className="text-xs">{getInitialName(other)}</AvatarFallback>
                                </Avatar>
                            </Link>
                            {hasUnread && (
                                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-orange border-2 border-white" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <Link href={`/user/${other.username}`} target="_blank">
                                <p className={`text-sm truncate ${hasUnread ? "font-bold text-black" : "font-semibold text-black"}`}>
                                    {getDisplayName(other)}
                                </p>
                            </Link>
                            {lastMsg ? (
                                <p className={`text-xs truncate ${hasUnread ? "text-neutral-600 font-medium" : "text-neutral-400"}`}>
                                    {lastMsg.senderId === currentUserId ? "Vous : " : ""}
                                    {lastMsg.content}
                                </p>
                            ) : (
                                <p className="text-xs text-neutral-300 italic">Pas encore de message</p>
                            )}
                        </div>

                        <span className="text-xs text-neutral-300 shrink-0">
                            {lastMsg ? formatDate(lastMsg.createdAt) : ""}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
