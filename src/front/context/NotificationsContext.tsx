"use client";

import React, { createContext, useContext, useCallback, useState } from "react";

export interface AblyNotification {
  id: string;
  type: "new_application" | "application_status";
  title: string;
  description: string;
  data: Record<string, unknown>;
  timestamp: Date;
  read: boolean;
}

interface NotificationsContextType {
  notifications: AblyNotification[];
  isConnected: boolean;
  addNotification: (notification: AblyNotification) => void;
  setConnected: (connected: boolean) => void;
  markAsRead: (id: string) => void;
  dismissNotification: (id: string) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(
  undefined
);

export function NotificationsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notifications, setNotifications] = useState<AblyNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const addNotification = useCallback((notification: AblyNotification) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const setConnected = useCallback((connected: boolean) => {
    setIsConnected(connected);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        isConnected,
        addNotification,
        setConnected,
        markAsRead,
        dismissNotification,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within NotificationsProvider"
    );
  }
  return context;
}
