export interface UserConfig {
    id: string;
    title: string;
    content: Record<string, unknown>;
    userId: string;
    createdAt: string;
}

export async function fetchMyConfigs(): Promise<UserConfig[]> {
    const res = await fetch("/api/userConfig/me", { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur configs");
    const data = await res.json();
    return data.configs ?? [];
}

export async function createUserConfig(data: { title: string; content: Record<string, unknown> }): Promise<UserConfig> {
    const res = await fetch("/api/userConfig", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur création config");
    return (await res.json()).config;
}

export async function updateUserConfig(id: string, data: { title?: string; content?: Record<string, unknown> }): Promise<UserConfig> {
    const res = await fetch(`/api/userConfig/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Erreur mise à jour config");
    return (await res.json()).config;
}

export async function deleteUserConfig(id: string): Promise<void> {
    const res = await fetch(`/api/userConfig/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Erreur suppression config");
}
