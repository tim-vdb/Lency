import * as Ably from "ably";

// Initialisation paresseuse (lazy) du client Ably.
// On n'instancie le client qu'à la première utilisation réelle, pas à l'import
// du module : ça évite de planter au build Next ("Collecting page data") ou dans
// tout contexte où ABLY_API_KEY n'est pas encore disponible.
let _ably: Ably.Rest | null = null;

function getAbly(): Ably.Rest {
  if (_ably) return _ably;
  const apiKey = process.env.ABLY_API_KEY;
  if (!apiKey) {
    throw new Error("ABLY_API_KEY est manquante");
  }
  _ably = new Ably.Rest({ key: apiKey });
  return _ably;
}

// Proxy lazy : conserve l'API existante (`ably.channels`, `ably.auth`…) tout en
// déclenchant l'initialisation seulement au premier accès, au runtime.
export const ably = new Proxy({} as Ably.Rest, {
  get(_target, prop) {
    const client = getAbly();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

/**
 * Envoyer une notification au propriétaire quand il reçoit une candidature
 * Channel: owner-applications-{ownerId} (le propriétaire du projet écoute ce channel)
 */
export async function notifyProjectOwnerNewApplication(
  ownerId: string,
  projectId: string,
  applicantName: string,
  applicantId: string,
  applicationId: string
) {
  try {
    const channelName = `owner-applications-${ownerId}`;
    console.error("[Ably] Publishing to channel:", channelName);

    const channel = ably.channels.get(channelName);
    await channel.publish("new_application", {
      applicantName,
      applicantId,
      applicationId,
      projectId,
      timestamp: new Date().toISOString(),
    });

    console.error("[Ably] Message published successfully to:", channelName);
  } catch (error) {
    console.error("[Ably] Error sending notification:", error);
  }
}

/**
 * Envoyer une notification au candidat quand sa candidature est acceptée/rejetée
 * Channel: user-notifications-{userId}
 */
export async function notifyUserApplicationStatus(
  userId: string,
  projectTitle: string,
  status: "ACCEPTED" | "REJECTED",
  applicationId: string
) {
  try {
    const channel = ably.channels.get(`user-notifications-${userId}`);
    await channel.publish("application_status", {
      projectTitle,
      status,
      applicationId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error sending Ably notification:", error);
  }
}

export async function NotifyNewProject(userId: string, projectId: string) {
  try {
    const userChannel = ably.channels.get(`user-notifications-${userId}`);
    await userChannel.publish("new_project", {
      projectId,
      timestamp: new Date().toISOString(),
    });

    const feedChannel = ably.channels.get("projects-feed");
    await feedChannel.publish("project_created", {
      projectId,
      userId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error sending Ably notification:", error);
  }
}

/**
 * Signaler à un utilisateur qu'il a reçu un message projet (pour mettre à jour le badge)
 * Channel: user-notifications-{userId}
 */
export async function notifyUserProjectMessage(userId: string, projectId: string) {
  try {
    const channel = ably.channels.get(`user-notifications-${userId}`);
    await channel.publish("project_message", { projectId, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("[Ably] Error sending project_message notification:", error);
  }
}

/**
 * Publier un nouveau message dans le chat projet
 * Channel: project-chat-{projectId} (tous les membres du projet écoutent ce channel)
 */
export async function notifyProjectMessage(
  projectId: string,
  message: {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    createdAt: string;
    sender: { id: string; firstname: string | null; lastname: string | null; username: string | null; image: string | null };
    imageUrls?: string[];
    audioUrls?: string[];
    videoUrls?: string[];
  }
) {
  try {
    const channel = ably.channels.get(`project-chat-${projectId}`);
    await channel.publish("new_message", message);
  } catch (error) {
    console.error("[Ably] Error sending project message:", error);
  }
}

/**
 * Publier un nouveau message direct
 * Channel: user-dms-{userId} (chaque destinataire écoute son propre channel DM)
 */
export async function notifyDirectMessage(
  recipientId: string,
  message: {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    content: string;
    createdAt: string;
    sender: { id: string; firstname: string | null; lastname: string | null; username: string | null; image: string | null };
    imageUrls?: string[];
    audioUrls?: string[];
    videoUrls?: string[];
  }
) {
  try {
    const channel = ably.channels.get(`user-dms-${recipientId}`);
    await channel.publish("new_message", message);
  } catch (error) {
    console.error("[Ably] Error sending direct message:", error);
  }
}

/**
 * Notifier quand quelqu'un suit l'utilisateur
 * Channel: user-notifications-{userId}
 */
export async function notifyNewFollower(userId: string, followerName: string, followerId: string) {
  try {
    const channel = ably.channels.get(`user-notifications-${userId}`);
    await channel.publish("new_follower", {
      followerId,
      followerName,
      timestamp: new Date().toISOString(),
    });

    const feedChannel = ably.channels.get("community-feed");
    await feedChannel.publish("new_follower", {
      userId,
      followerId,
      followerName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Ably] Error sending follower notification:", error);
  }
}

/**
 * Notifier l'auteur d'un post quand quelqu'un commente
 * Channel: user-notifications-{postAuthorId}
 */
export async function notifyCommentOnPost(postAuthorId: string, commentAuthorName: string, postId: string, commentId: string) {
  try {
    const channel = ably.channels.get(`user-notifications-${postAuthorId}`);
    await channel.publish("comment_on_post", {
      postId,
      commentId,
      commentAuthorName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Ably] Error sending comment notification:", error);
  }
}

/**
 * Notifier l'auteur d'un commentaire quand quelqu'un répond
 * Channel: user-notifications-{commentAuthorId}
 */
export async function notifyCommentReply(commentAuthorId: string, replyAuthorName: string, postId: string, commentId: string, replyId: string) {
  try {
    const channel = ably.channels.get(`user-notifications-${commentAuthorId}`);
    await channel.publish("reply_to_comment", {
      postId,
      commentId,
      replyId,
      replyAuthorName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Ably] Error sending reply notification:", error);
  }
}

/**
 * Notifier l'auteur d'une ressource quand quelqu'un commente
 * Channel: user-notifications-{resourceAuthorId}
 */
export async function notifyCommentOnResource(resourceAuthorId: string, commentAuthorName: string, resourceId: string, commentId: string) {
  try {
    const channel = ably.channels.get(`user-notifications-${resourceAuthorId}`);
    await channel.publish("comment_on_resource", {
      resourceId,
      commentId,
      commentAuthorName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Ably] Error sending resource comment notification:", error);
  }
}

/**
 * Notifier l'auteur d'une ressource quand quelqu'un répond à un commentaire
 * Channel: user-notifications-{resourceAuthorId}
 */
export async function notifyResourceCommentReply(resourceAuthorId: string, replyAuthorName: string, resourceId: string, commentId: string, replyId: string) {
  try {
    const channel = ably.channels.get(`user-notifications-${resourceAuthorId}`);
    await channel.publish("reply_to_resource_comment", {
      resourceId,
      commentId,
      replyId,
      replyAuthorName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Ably] Error sending resource reply notification:", error);
  }
}

/**
 * Notifier les membres d'un projet quand quelqu'un commente
 * Channel: user-notifications-{userId} pour chaque destinataire
 */
export async function notifyCommentOnProject(recipientIds: string[], commentAuthorName: string, commentAuthorId: string, projectId: string, commentId: string) {
  try {
    for (const userId of recipientIds) {
      const channel = ably.channels.get(`user-notifications-${userId}`);
      await channel.publish("comment_on_project", {
        projectId,
        commentId,
        commentAuthorName,
        commentAuthorId,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("[Ably] Error sending project comment notification:", error);
  }
}

/**
 * Notifier un utilisateur quand il est ajouté à un projet
 * Channel: user-notifications-{userId}
 */
export async function notifyAddedToProject(userId: string, projectTitle: string, projectId: string, addedByName: string) {
  try {
    const channel = ably.channels.get(`user-notifications-${userId}`);
    await channel.publish("added_to_project", {
      projectId,
      projectTitle,
      addedByName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Ably] Error sending added to project notification:", error);
  }
}

/**
 * Notifier les membres d'un projet quand son statut change
 * Channel: user-notifications-{userId} pour chaque destinataire
 */
/**
 * Notifier les abonnés d'une catégorie quand un nouveau post ou une ressource est créé
 * Channel: user-notifications-{userId} pour chaque abonné
 */
/**
 * Publier sur le feed communautaire quand un post est créé dans une catégorie
 * → tous les viewers connectés invalident leur cache React Query
 */
export async function notifyCategoryFeedUpdate(categoryId: string, postId: string) {
  try {
    const channel = ably.channels.get("community-feed");
    await channel.publish("category_post_created", { categoryId, postId, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("[Ably] Error publishing category feed update:", error);
  }
}

export async function notifyCategoryNewContent(
  subscriberIds: string[],
  categoryId: string,
  categoryName: string,
  type: "post" | "resource",
  contentId: string,
  authorName: string
) {
  try {
    const event = type === "post" ? "category_new_post" : "category_new_resource";
    for (const userId of subscriberIds) {
      const channel = ably.channels.get(`user-notifications-${userId}`);
      await channel.publish(event, {
        categoryId,
        categoryName,
        contentId,
        authorName,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("[Ably] Error sending category content notification:", error);
  }
}

export async function notifyProjectStatusChanged(recipientIds: string[], projectId: string, newStatus: string, changedByName: string) {
  try {
    for (const userId of recipientIds) {
      const channel = ably.channels.get(`user-notifications-${userId}`);
      await channel.publish("project_status_changed", {
        projectId,
        newStatus,
        changedByName,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("[Ably] Error sending project status notification:", error);
  }
}

/**
 * Notifier un utilisateur qu'il a reçu une invitation à rejoindre un projet
 * Channel: user-notifications-{userId}
 */
export async function notifyProjectInvitation(
  userId: string,
  projectTitle: string,
  projectId: string,
  invitationId: string,
  ownerName: string
) {
  try {
    const channel = ably.channels.get(`user-notifications-${userId}`);
    await channel.publish("project_invitation", {
      projectTitle,
      projectId,
      invitationId,
      ownerName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Ably] Error sending project_invitation:", error);
  }
}

/**
 * Notifier le owner qu'une invitation a été acceptée ou refusée
 * Channel: user-notifications-{ownerId}
 */
export async function notifyInvitationUpdate(ownerId: string, projectId: string, status: "ACCEPTED" | "REJECTED") {
  try {
    const channel = ably.channels.get(`user-notifications-${ownerId}`);
    await channel.publish("invitation_update", { projectId, status, timestamp: new Date().toISOString() });
  } catch (error) {
    console.error("[Ably] Error sending invitation_update:", error);
  }
}

/**
 * Notifier tous les clients qu'un projet a changé de visibilité (public ↔ privé)
 * Channel: projects-feed
 */
export async function notifyProjectVisibilityChanged(projectId: string, visibility: string) {
  try {
    const channel = ably.channels.get("projects-feed");
    await channel.publish("project_visibility_changed", {
      projectId,
      visibility,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Ably] Error sending project_visibility_changed:", error);
  }
}

/**
 * Notifier tous les clients qu'un utilisateur a changé son statut readyToStart
 * Channel: users-feed (global, écouté par tous les owners qui ont le bloc invitation ouvert)
 */
export async function notifyUserReadyStatusChanged(userId: string, readyToStart: boolean) {
  try {
    const channel = ably.channels.get("users-feed");
    await channel.publish("user_ready_status_changed", {
      userId,
      readyToStart,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[Ably] Error sending user_ready_status_changed:", error);
  }
}
