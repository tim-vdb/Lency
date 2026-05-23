export interface Talent {
    id: string;
    firstname: string | null;
    lastname: string | null;
    username: string | null;
    image: string | null;
    avatarUrl: string | null;
    bio: string | null;
    badges: { id: string; name: string }[];
    _count: { followers: number };
}

export async function fetchTalents(): Promise<Talent[]> {
    const res = await fetch("/api/talents", { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur lors de la récupération des talents");
    const data = await res.json();
    return data.talents ?? [];
}
