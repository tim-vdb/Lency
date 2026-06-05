import { ArrowRight, Folder } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn, getDisplayName } from "@/front/lib/utils";
import { LEVEL_COLORS, WORK_MODE_LABELS } from "./SearchBar.constants";
import type { SearchResults } from "@/front/lib/api/search";

type Project = SearchResults["projects"][number];

export function SearchProjectItem({ project, query, onClose }: { project: Project; query: string; onClose: () => void }) {
    return (
        <Link
            href={`/marketplace/${project.id}`}
            onClick={onClose}
            className="group flex items-start gap-3 px-2.5 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-100"
        >
            {project.bannerUrl ? (
                <div className="w-9 h-9 rounded-md overflow-hidden shrink-0 border border-neutral-200 dark:border-neutral-800">
                    <Image src={project.bannerUrl} alt={project.title} width={36} height={36} className="w-full h-full object-cover" />
                </div>
            ) : (
                <div className="w-9 h-9 rounded-md bg-linear-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <Folder className="w-4 h-4 text-violet-500 dark:text-violet-400" />
                </div>
            )}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">
                    {project.title}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    {project.level && (
                        <span className={cn("text-[10px] font-medium px-1.5 py-px rounded-full", LEVEL_COLORS[project.level] ?? "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400")}>
                            {project.level.charAt(0) + project.level.slice(1).toLowerCase()}
                        </span>
                    )}
                    {project.workMode && (
                        <span className="text-[10px] text-neutral-500">
                            {WORK_MODE_LABELS[project.workMode] ?? project.workMode}
                        </span>
                    )}
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-600">·</span>
                    <span className="text-[10px] text-neutral-500 truncate">{getDisplayName(project.owner)}</span>
                </div>
                {query && project.excerpt && (
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-600 truncate mt-0.5 italic">
                        {project.excerpt}
                    </p>
                )}
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700 group-hover:text-neutral-500 dark:group-hover:text-neutral-400 shrink-0 mt-1 transition-colors" />
        </Link>
    );
}
