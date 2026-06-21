export type DBNotification = {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string;
  data: unknown;
  read: boolean;
  createdAt: string;
};

export async function fetchNotifications(): Promise<DBNotification[]> {
  const res = await fetch("/api/notifications", { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur fetch notifications");
  return (await res.json()).notifications;
}

export async function markNotificationRead(id: string): Promise<void> {
  await fetch(`/api/notifications/${id}`, { method: "PATCH" });
}

export async function dismissNotificationApi(id: string): Promise<void> {
  await fetch(`/api/notifications/${id}`, { method: "DELETE" });
}
