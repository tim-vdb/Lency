import { Folder, Tag, FileText, BookOpen, Sparkles } from "lucide-react";
import type React from "react";

export const WORK_MODE_LABELS: Record<string, string> = {
    PRESENTIEL: "Présentiel",
    DISTANCIEL: "Distanciel",
    HYBRIDE: "Hybride",
};

export const LEVEL_COLORS: Record<string, string> = {
    DEBUTANT: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    INTERMEDIAIRE: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    AVANCE: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};

export type FilterKey = "" | "projects" | "categories" | "posts" | "resources";

export const FILTERS: { key: FilterKey; label: string; icon: React.ElementType }[] = [
    { key: "", label: "Tout", icon: Sparkles },
    { key: "projects", label: "Projets", icon: Folder },
    { key: "categories", label: "Communautés", icon: Tag },
    { key: "posts", label: "Posts", icon: FileText },
    { key: "resources", label: "Ressources", icon: BookOpen },
];
