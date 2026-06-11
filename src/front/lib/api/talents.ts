export interface TalentConfig {
    title: string;
    content: unknown;
}

export interface Talent {
    id: string;
    firstname: string | null;
    lastname: string | null;
    username: string | null;
    image: string | null;
    avatarUrl: string | null;
    bio: string | null;
    address: string | null;
    latitude: number | null;
    longitude: number | null;
    portfolio: string | null;
    cv: string | null;
    badges: { id: string; name: string }[];
    categoryFollows: { category: { id: string; name: string } }[];
    configs: TalentConfig[];
    _count: { followers: number; participants: number; projects: number };
}

export function getTalentRoles(talent: Talent): string[] {
    const cfg = talent.configs?.find((c) => c.title === "roles");
    if (!cfg) return [];
    const content = cfg.content as { roles?: string[] };
    return content?.roles ?? [];
}

export interface TalentPreferences {
    workMode?: string;
    level?: string;
    remunerationType?: string;
}

export function getTalentPreferences(talent: Talent): TalentPreferences {
    const cfg = talent.configs?.find((c) => c.title === "preferences");
    if (!cfg) return {};
    return (cfg.content as TalentPreferences) ?? {};
}

export function getTalentEquipment(talent: Talent): string[] {
    const cfg = talent.configs?.find((c) => c.title === "audiovisual");
    if (!cfg) return [];
    const content = cfg.content as Record<string, string[]>;
    return Object.values(content).flat().filter(Boolean).slice(0, 4);
}

export async function fetchTalents(): Promise<Talent[]> {
    const res = await fetch("/api/talents", { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur lors de la récupération des talents");
    const data = await res.json();
    return data.talents ?? [];
}
