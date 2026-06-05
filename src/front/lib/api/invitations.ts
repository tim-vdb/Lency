export type InvitationUser = {
    id: string;
    firstname: string | null;
    lastname: string | null;
    username: string | null;
    image: string | null;
    avatarUrl: string | null;
};

export type ProjectInvitation = {
    id: string;
    projectId: string;
    userId: string;
    status: "PENDING" | "ACCEPTED" | "REJECTED";
    sentAt: string;
    respondedAt: string | null;
    user: InvitationUser;
};

export type ReadyUser = {
    id: string;
    firstname: string | null;
    lastname: string | null;
    username: string | null;
    image: string | null;
    avatarUrl: string | null;
    bio: string | null;
    configs: { content: unknown }[];
};

export async function sendInvitation(projectId: string, userId: string): Promise<ProjectInvitation> {
    const res = await fetch(`/api/projects/${projectId}/invitations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Erreur lors de l'invitation");
    }
    return (await res.json()).invitation;
}

export async function getProjectInvitations(projectId: string): Promise<ProjectInvitation[]> {
    const res = await fetch(`/api/projects/${projectId}/invitations`, { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur fetch invitations");
    return (await res.json()).invitations;
}

export async function respondToInvitation(invitationId: string, action: "accept" | "reject"): Promise<ProjectInvitation> {
    const res = await fetch(`/api/projects/invitations/${invitationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
    });
    if (!res.ok) throw new Error("Erreur lors de la réponse");
    return (await res.json()).invitation;
}

export async function searchReadyUsers(q: string): Promise<ReadyUser[]> {
    const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur recherche");
    return (await res.json()).users;
}
