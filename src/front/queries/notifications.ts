import { queryOptions, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  markNotificationRead,
  dismissNotificationApi,
  type DBNotification,
} from "@/front/lib/api/notifications";

export type { DBNotification };

const NOTIF_ROOT = ["notifications"] as const;

export const notificationQueries = {
  list: () =>
    queryOptions({
      queryKey: [...NOTIF_ROOT, "list"],
      queryFn: fetchNotifications,
      staleTime: 1000 * 30,
    }),
};

export const useNotificationsQuery = () => useQuery(notificationQueries.list());

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey }),
  });
};

export const useDismissNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dismissNotificationApi,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey }),
  });
};
