"use client";

import { useQuery, useMutation, useQueryClient, queryOptions } from "@tanstack/react-query";
import {
  fetchProjectMessages,
  sendProjectMessage,
  type ProjectMessage,
} from "@/front/lib/api/project-messages";
import { useUser } from "@/front/context/UserContext";

const ROOT = ["project-messages"] as const;

export const projectMessageQueries = {
  list: (projectId: string) =>
    queryOptions({
      queryKey: [...ROOT, projectId],
      queryFn: () => fetchProjectMessages(projectId),
      staleTime: 0,
    }),
};

export const useProjectMessages = (projectId: string) =>
  useQuery(projectMessageQueries.list(projectId));

type SendMessageInput = {
  content: string;
  imageUrls?: string[];
  audioUrls?: string[];
  videoUrls?: string[];
};

export const useSendProjectMessage = (projectId: string) => {
  const queryClient = useQueryClient();
  const user = useUser();
  const listKey = projectMessageQueries.list(projectId).queryKey;

  return useMutation({
    mutationFn: ({ content, imageUrls, audioUrls, videoUrls }: SendMessageInput) =>
      sendProjectMessage(projectId, content, { imageUrls, audioUrls, videoUrls }),
    onMutate: async ({ content, imageUrls = [], audioUrls = [], videoUrls = [] }) => {
      await queryClient.cancelQueries({ queryKey: listKey });
      const previous = queryClient.getQueryData<ProjectMessage[]>(listKey);
      queryClient.setQueryData<ProjectMessage[]>(listKey, (old = []) => [
        ...old,
        {
          id: `optimistic-${Date.now()}`,
          projectId,
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
    onSettled: () => queryClient.invalidateQueries({ queryKey: listKey }),
  });
};
