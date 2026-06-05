"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ActiveChatContextType = {
  activeProjectChatId: string | null;
  activeDMConversationId: string | null;
  setActiveProjectChat: (projectId: string | null) => void;
  setActiveDMConversation: (conversationId: string | null) => void;
};

const ActiveChatContext = createContext<ActiveChatContextType>({
  activeProjectChatId: null,
  activeDMConversationId: null,
  setActiveProjectChat: () => {},
  setActiveDMConversation: () => {},
});

export function ActiveChatProvider({ children }: { children: ReactNode }) {
  const [activeProjectChatId, setActiveProjectChatId] = useState<string | null>(null);
  const [activeDMConversationId, setActiveDMConversationId] = useState<string | null>(null);

  return (
    <ActiveChatContext.Provider
      value={{
        activeProjectChatId,
        activeDMConversationId,
        setActiveProjectChat: setActiveProjectChatId,
        setActiveDMConversation: setActiveDMConversationId,
      }}
    >
      {children}
    </ActiveChatContext.Provider>
  );
}

export const useActiveChat = () => useContext(ActiveChatContext);
