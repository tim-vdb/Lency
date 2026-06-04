"use client";

import React, { createContext, useContext, useCallback, useState } from "react";

interface NotificationsContextType {
  isConnected: boolean;
  setConnected: (connected: boolean) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);

  const setConnected = useCallback((connected: boolean) => {
    setIsConnected(connected);
  }, []);

  return (
    <NotificationsContext.Provider value={{ isConnected, setConnected }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) return { isConnected: false, setConnected: (_: boolean) => {} };
  return context;
}
