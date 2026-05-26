"use client";

import { useEffect, useState, useCallback } from "react";
import * as Ably from "ably";
import { useUser } from "@/front/context/UserContext";
import { useNotifications } from "@/front/context/NotificationsContext";

export interface AblyNotification {
  id: string;
  type: "new_application" | "application_status";
  title: string;
  description: string;
  data: Record<string, any>;
  timestamp: Date;
  read: boolean;
}

/**
 * Hook pour écouter les notifications Ably en temps réel
 * Subscribe à deux channels :
 * - project-applications-{projectId} (notifs du propriétaire quand reçoit candidature)
 * - user-notifications-{userId} (notifs du candidat sur statut candidature)
 */
export const useAblyNotifications = () => {
  const user = useUser();
  const { setAblyState } = useNotifications();
  const [notifications, setNotifications] = useState<AblyNotification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Sync local state to context
  const syncToContext = useCallback(() => {
    setAblyState(notifications, isConnected);
  }, [notifications, isConnected, setAblyState]);

  useEffect(() => {
    syncToContext();
  }, [notifications, isConnected, syncToContext]);

  useEffect(() => {
    console.log("[Ably] useEffect triggered, user?.id:", user?.id);
    if (!user?.id) {
      console.log("[Ably] No user ID, skipping initialization");
      return;
    }

    // Créer le client Ably avec tokenAuth (pas besoin d'exposer la clé API côté client)
    // La clé API est utilisée côté serveur uniquement
    let realtimeClient: Ably.Realtime | null = null;

    const initializeAbly = async () => {
      try {
        console.log("[Ably] Starting initialization for user:", user.id);

        // Initialiser avec authUrl - le serveur fournira un token à chaque reconnexion
        realtimeClient = new Ably.Realtime({
          authUrl: "/api/ably/token",
        });
        console.log("[Ably] Realtime client created with authUrl");

        realtimeClient.connection.on("connected", () => {
          console.log("[Ably] Connection established");
          setIsConnected(true);

          // Subscribe aux notifications du propriétaire
          // (quand des gens candidatent à ses projets)
          const ownerChannelName = `owner-applications-${user.id}`;
          console.log("[Ably] Subscribing to owner channel:", ownerChannelName);

          const ownerAppsChannel = realtimeClient!.channels.get(ownerChannelName);
          ownerAppsChannel.subscribe("new_application", (message) => {
            console.log("[Ably] Received new_application message:", message.data);
            const notification: AblyNotification = {
              id: `${Date.now()}-${Math.random()}`,
              type: "new_application",
              title: `${message.data.applicantName} a candidaté`,
              description: "Cliquez pour voir et répondre",
              data: message.data,
              timestamp: new Date(),
              read: false,
            };
            console.log("[Ably] Adding notification:", notification);
            setNotifications((prev) => [notification, ...prev]);
          });

          // Subscribe aux notifications du candidat
          // (quand le statut de sa candidature change)
          const userChannelName = `user-notifications-${user.id}`;
          console.log("[Ably] Subscribing to user notifications channel:", userChannelName);

          const userNotifChannel = realtimeClient!.channels.get(userChannelName);
          userNotifChannel.subscribe("application_status", (message) => {
            console.log("[Ably] Received application_status message:", message.data);
            const statusText =
              message.data.status === "ACCEPTED" ? "acceptée ✅" : "refusée ❌";
            const notification: AblyNotification = {
              id: `${Date.now()}-${Math.random()}`,
              type: "application_status",
              title: `Candidature ${statusText}`,
              description: `Votre candidature au projet "${message.data.projectTitle}" a été ${statusText}`,
              data: message.data,
              timestamp: new Date(),
              read: false,
            };
            console.log("[Ably] Adding status notification:", notification);
            setNotifications((prev) => [notification, ...prev]);
          });
        });

        realtimeClient.connection.on("disconnected", () => {
          console.log("[Ably] Connection disconnected");
          setIsConnected(false);
        });

        realtimeClient.connection.on("failed", (err) => {
          console.error("[Ably] Connection failed:", err);
          setIsConnected(false);
        });

        realtimeClient.connection.on("connecting", () => {
          console.log("[Ably] Attempting to connect...");
        });

        realtimeClient.connection.on("suspended", () => {
          console.log("[Ably] Connection suspended");
        });

        console.log("[Ably] Event listeners attached, waiting for connection...");
      } catch (error) {
        console.error("[Ably] Failed to initialize Ably:", error);
        setIsConnected(false);
      }
    };

    initializeAbly();

    return () => {
      console.log("[Ably] Cleanup: closing realtime client");
      if (realtimeClient) {
        realtimeClient.close();
      }
    };
  }, [user?.id]);

  return { notifications, isConnected };
};
