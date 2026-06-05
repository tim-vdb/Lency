"use client";

import React, { useEffect, useState } from "react";
import * as Ably from "ably";
import { useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/front/states/contexts/user.context";
import { useNotifications } from "@/front/states/contexts/notifications.context";
import { AblyContext } from "@/front/states/contexts/ably.context";
import {
  notificationQueries,
  useNotificationsQuery,
} from "@/front/queries/notifications";

export function AblyInitializer({ children }: { children?: React.ReactNode }) {
  const user = useUser();
  const { setConnected } = useNotifications();
  const queryClient = useQueryClient();
  const [ablyClient, setAblyClient] = useState<Ably.Realtime | null>(null);
  // Observer permanent : garantit que invalidateQueries déclenche un refetch
  // même quand le panel notifications est fermé.
  useNotificationsQuery();

  useEffect(() => {
    if (!user?.id) return;

    const client = new Ably.Realtime({ authUrl: "/api/ably/token" });
    setAblyClient(client);

    client.connection.on("connected", () => {
      console.warn("[Ably] ✅ Connected — user:", user.id);
      setConnected(true);
    });
    client.connection.on("disconnected", () => {
      console.warn("[Ably] ❌ Disconnected");
      setConnected(false);
    });
    client.connection.on("failed", (err) => {
      console.warn("[Ably] ❌ Failed:", err);
      setConnected(false);
    });
    // @ts-expect-error Ably doesn't expose 'error' event type
    client.connection.on("error", () => {
      // swallow connection errors during StrictMode cleanup
    });

    const ownerChannelName = `owner-applications-${user.id}`;
    console.warn("[Ably] Subscribing to:", ownerChannelName);
    const ownerChannel = client.channels.get(ownerChannelName);
    ownerChannel.subscribe("new_application", (msg) => {
      console.warn("[Ably] 📨 new_application received:", msg.data);
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
    });

    const userChannelName = `user-notifications-${user.id}`;
    console.warn("[Ably] Subscribing to:", userChannelName);
    const userChannel = client.channels.get(userChannelName);
    userChannel.subscribe("application_status", (msg) => {
      console.warn("[Ably] 📨 application_status received:", msg.data);
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
    });
    userChannel.subscribe("project_message", (msg) => {
      console.warn("[Ably] 📨 project_message received:", msg.data);
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
    });
    userChannel.subscribe("new_project", (msg) => {
      console.warn("[Ably] 📨 new_project received:", msg.data);
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
    });

    const feedChannel = client.channels.get("projects-feed");
    console.warn("[Ably] Subscribing to: projects-feed");
    feedChannel.subscribe("project_created", (msg) => {
      if (msg.data.userId === user.id) return;
      console.warn("[Ably] 📨 project_created received:", msg.data);
      queryClient.invalidateQueries({ queryKey: ["projects", "list"] });
    });
    feedChannel.subscribe("project_visibility_changed", (msg) => {
      console.warn("[Ably] 📨 project_visibility_changed received:", msg.data);
      queryClient.invalidateQueries({ queryKey: ["projects", "list"] });
      queryClient.invalidateQueries({ queryKey: ["projects", "detail", msg.data.projectId] });
    });

    const usersFeedChannel = client.channels.get("users-feed");
    console.warn("[Ably] Subscribing to: users-feed");
    usersFeedChannel.subscribe("user_ready_status_changed", (msg) => {
      console.warn("[Ably] 📨 user_ready_status_changed received:", msg.data);
      queryClient.invalidateQueries({ queryKey: ["invitations", "ready-users"] });
    });

    // Channel DM personnel : reçoit les messages directs en temps réel
    const dmChannelName = `user-dms-${user.id}`;
    console.warn("[Ably] Subscribing to:", dmChannelName);
    const dmChannel = client.channels.get(dmChannelName);
    dmChannel.subscribe("new_message", (msg) => {
      console.warn("[Ably] 📨 dm new_message received:", msg.data);
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    });

    // ─── COMMUNAUTÉ NOTIFICATIONS ────────────────────────────────────

    // Followers
    userChannel.subscribe("new_follower", (msg) => {
      console.warn("[Ably] 📨 new_follower received:", msg.data);
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
    });

    // Comments on posts
    userChannel.subscribe("comment_on_post", (msg) => {
      console.warn("[Ably] 📨 comment_on_post received:", msg.data);
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
    });

    // Replies to comments
    userChannel.subscribe("reply_to_comment", (msg) => {
      console.warn("[Ably] 📨 reply_to_comment received:", msg.data);
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
    });

    // Comments on resources
    userChannel.subscribe("comment_on_resource", (msg) => {
      console.warn("[Ably] 📨 comment_on_resource received:", msg.data);
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
    });

    // Replies on resource comments
    userChannel.subscribe("reply_to_resource_comment", (msg) => {
      console.warn("[Ably] 📨 reply_to_resource_comment received:", msg.data);
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
    });

    // Global community feed
    const communityFeedChannel = client.channels.get("community-feed");
    communityFeedChannel.subscribe("new_follower", (msg) => {
      if (msg.data.followerId === user.id) return;
      console.warn("[Ably] 📨 community new_follower received:", msg.data);
    });

    // Nouveau post dans une catégorie — invalide pour TOUS les viewers (bell ON ou OFF)
    communityFeedChannel.subscribe("category_post_created", (msg) => {
      console.warn("[Ably] 📨 category_post_created received:", msg.data);
      queryClient.invalidateQueries({ queryKey: ["categories", msg.data.categoryId, "posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts", "list"] });
    });

    // ─── PROJETS NOTIFICATIONS ──────────────────────────────────────

    // Comments on project (reçu sur user-notifications-{userId})
    userChannel.subscribe("comment_on_project", (msg) => {
      console.warn("[Ably] 📨 comment_on_project received:", msg.data);
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
    });

    // Project status changed (reçu sur user-notifications-{userId})
    userChannel.subscribe("project_status_changed", (msg) => {
      console.warn("[Ably] 📨 project_status_changed received:", msg.data);
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
    });

    // Added to project
    userChannel.subscribe("added_to_project", (msg) => {
      console.warn("[Ably] 📨 added_to_project received:", msg.data);
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
    });

    // Invitation à rejoindre un projet
    userChannel.subscribe("project_invitation", (msg) => {
      console.warn("[Ably] 📨 project_invitation received:", msg.data);
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
    });

    // Invitation acceptée (notif pour le owner)
    userChannel.subscribe("invitation_accepted", (msg) => {
      console.warn("[Ably] 📨 invitation_accepted received:", msg.data);
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
    });

    // Réponse à une invitation (acceptée ou refusée) — met à jour la liste d'invitations + membres
    userChannel.subscribe("invitation_update", (msg) => {
      console.warn("[Ably] 📨 invitation_update received:", msg.data);
      const projectId = msg.data?.projectId;
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: ["invitations", "project", projectId] });
        queryClient.invalidateQueries({ queryKey: ["projects", "detail", projectId] });
      }
    });

    // Nouveau post dans une catégorie suivie
    userChannel.subscribe("category_new_post", (msg) => {
      console.warn("[Ably] 📨 category_new_post received:", msg.data);
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
      queryClient.invalidateQueries({ queryKey: ["categories", msg.data.categoryId, "posts"] });
    });

    // Nouvelle ressource dans une catégorie suivie
    userChannel.subscribe("category_new_resource", (msg) => {
      console.warn("[Ably] 📨 category_new_resource received:", msg.data);
      queryClient.invalidateQueries({ queryKey: notificationQueries.list().queryKey });
      queryClient.invalidateQueries({ queryKey: ["resources", "list"] });
    });

    return () => {
      setAblyClient(null);
      try {
        [ownerChannelName, userChannelName, "projects-feed", "users-feed", dmChannelName, "community-feed"].forEach((ch) => {
          try { client.channels.release(ch); } catch { /* already released */ }
        });
        const state = client.connection.state;
        if (state !== "closed" && state !== "failed" && state !== "closing") {
          client.connection.off();
          client.close();
        }
      } catch {
        // connexion déjà fermée (StrictMode double-invoke ou échec auth)
      }
    };
  }, [user?.id, setConnected, queryClient]);

  return (
    <AblyContext.Provider value={ablyClient}>
      {children}
    </AblyContext.Provider>
  );
}
