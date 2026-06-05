export type ProjectMessageSender = {
  id: string;
  firstname: string | null;
  lastname: string | null;
  username: string | null;
  image: string | null;
};

export type ProjectMessage = {
  id: string;
  projectId: string;
  senderId: string;
  content: string;
  imageUrls: string[];
  audioUrls: string[];
  videoUrls: string[];
  createdAt: string;
  sender: ProjectMessageSender;
};

export async function fetchProjectMessages(projectId: string): Promise<ProjectMessage[]> {
  const res = await fetch(`/api/projects/${projectId}/messages`, { cache: "no-store" });
  if (!res.ok) throw new Error("Erreur fetch project messages");
  return (await res.json()).messages;
}

export async function sendProjectMessage(
  projectId: string,
  content: string,
  media?: { imageUrls?: string[]; audioUrls?: string[]; videoUrls?: string[] }
): Promise<ProjectMessage> {
  const res = await fetch(`/api/projects/${projectId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, ...media }),
  });
  if (!res.ok) throw new Error("Erreur envoi message projet");
  return (await res.json()).message;
}
