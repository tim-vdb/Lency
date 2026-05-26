"use client";

import { useEffect } from "react";
import * as Ably from "ably";
import { useUser } from "@/front/context/UserContext";
import { useNotifications } from "@/front/context/NotificationsContext";

/**
 * Initialise la connexion Ably et pousse les notifications directement dans le contexte.
 * Doit être rendu à l'intérieur de UserProvider ET NotificationsProvider.
 */
export function AblyInitializer() {
  const user = useUser();
  const { addNotification, setConnected } = useNotifications();

  useEffect(() => {
    if (!user?.id) return;

    console.error("[Ably] Initializing for user:", user.id);

    const client = new Ably.Realtime({ authUrl: "/api/ably/token" });

    client.connection.on("connecting", () => {
      console.error("[Ably] Connecting...");
    });

    client.connection.on("connected", () => {
      console.error("[Ably] Connected!");
      setConnected(true);

      const ownerChannelName = `owner-applications-${user.id}`;
      console.error("[Ably] Subscribing to:", ownerChannelName);

      const ownerChannel = client.channels.get(ownerChannelName);
      ownerChannel.subscribe("new_application", (message) => {
        console.error("[Ably] Received new_application:", message.data);
        addNotification({
          id: `${Date.now()}-${Math.random()}`,
          type: "new_application",
          title: `${message.data.applicantName} a candidaté`,
          description: "Cliquez pour voir et répondre",
          data: message.data,
          timestamp: new Date(),
          read: false,
        });
      });

      const userChannelName = `user-notifications-${user.id}`;
      console.error("[Ably] Subscribing to:", userChannelName);

      const userChannel = client.channels.get(userChannelName);
      userChannel.subscribe("application_status", (message) => {
        console.error("[Ably] Received application_status:", message.data);
        const statusText =
          message.data.status === "ACCEPTED" ? "acceptée ✅" : "refusée ❌";
        addNotification({
          id: `${Date.now()}-${Math.random()}`,
          type: "application_status",
          title: `Candidature ${statusText}`,
          description: `Votre candidature au projet "${message.data.projectTitle}" a été ${statusText}`,
          data: message.data,
          timestamp: new Date(),
          read: false,
        });
      });
    });

    client.connection.on("disconnected", () => {
      console.error("[Ably] Disconnected");
      setConnected(false);
    });

    client.connection.on("failed", (err) => {
      console.error("[Ably] Connection failed:", err);
      setConnected(false);
    });

    return () => {
      console.error("[Ably] Cleanup");
      client.close();
    };
  }, [user?.id, addNotification, setConnected]);

  return null;
}
