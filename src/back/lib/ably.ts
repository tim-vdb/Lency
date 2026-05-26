import * as Ably from "ably";

// Initialiser le client Ably avec la clé API
const apiKey = process.env.ABLY_API_KEY;
if (!apiKey) {
  throw new Error("ABLY_API_KEY est manquante");
}

export const ably = new Ably.Rest({ key: apiKey });

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
