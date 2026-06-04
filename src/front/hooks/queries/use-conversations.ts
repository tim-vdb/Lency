"use client";

import { useQuery, useMutation, useQueryClient, queryOptions } from "@tanstack/react-query";
import {
  fetchConversations,
  fetchConversationMessages,
  getOrCreateConversation,
  sendDirectMessage,
  type DirectMessage,
  type Conversation,
} from "@/front/lib/api/conversations";
import { useActiveChat } from "@/front/context/ActiveChatContext";
import { useUser } from "@/front/context/UserContext";

const ROOT = ["conversations"] as const;

export const conversationQueries = {
  list: () =>
    queryOptions({
      queryKey: [...ROOT, "list"],
      queryFn: fetchConversations,
      staleTime: 1000 * 30,
    }),
  messages: (conversationId: string) =>
    queryOptions({
      queryKey: [...ROOT, conversationId, "messages"],
      queryFn: () => fetchConversationMessages(conversationId),
      staleTime: 0,
      enabled: !!conversationId,
    }),
};

export const useConversations = () => useQuery(conversationQueries.list());

export const useConversationMessages = (conversationId: string) =>
  useQuery(conversationQueries.messages(conversationId));

export const useGetOrCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (otherUserId: string) => getOrCreateConversation(otherUserId),
    onSuccess: (conv) => {
      queryClient.setQueryData<Conversation[]>(conversationQueries.list().queryKey, (old = []) => {
        const exists = old.some((c) => c.id === conv.id);
        return exists ? old : [conv, ...old];
      });
    },
  });
};

export const useSendDirectMessage = (conversationId: string) => {
  const queryClient = useQueryClient();
  const user = useUser();
  const { activeDMConversationId } = useActiveChat();
  const listKey = conversationQueries.messages(conversationId).queryKey;

  return useMutation({
    mutationFn: ({ content, imageUrls, audioUrls, videoUrls }: { content: string; imageUrls?: string[]; audioUrls?: string[]; videoUrls?: string[] }) =>
      sendDirectMessage(conversationId, content, activeDMConversationId, { imageUrls, audioUrls, videoUrls }),
    onMutate: async ({ content, imageUrls = [], audioUrls = [], videoUrls = [] }) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<DirectMessage[]>(listKey);
      queryClient.setQueryData<DirectMessage[]>(listKey, (old = []) => [
        ...old,
        {
          id: `optimistic-${Date.now()}`,
          conversationId,
          senderId: "me",
          content,
          imageUrls,
          audioUrls,
          videoUrls,
          createdAt: new Date().toISOString(),
          sender: {
            id: user?.id ?? "me",
            firstname: user?.firstname ?? null,
            lastname: user?.lastname ?? null,
            username: user?.username ?? null,
            image: user?.image ?? null,
          },
        },
      ]);
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) queryClient.setQueryData(listKey, context.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: listKey });
      queryClient.invalidateQueries({ queryKey: conversationQueries.list().queryKey });
    },
  });
};
