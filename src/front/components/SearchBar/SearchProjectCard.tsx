import Link from "next/link";
import Image from "next/image";
import { Folder } from "lucide-react";
import { cn, getDisplayName } from "@/front/lib/utils";
import { LEVEL_COLORS, WORK_MODE_LABELS } from "./SearchBar.constants";
import type { SearchResults } from "@/front/lib/api/search";

type Project = SearchResults["projects"][number];

export function SearchProjectCard({ project, onClose }: { project: Project; onClose: () => void }) {
    return (
        <Link
            href={`/marketplace/${project.id}`}
            onClick={onClose}
            className="group flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-md transition-all duration-150"
        >
            {/* Banner */}
            <div className="relative h-[72px] bg-linear-to-br from-violet-500/10 to-indigo-500/10 dark:from-violet-500/5 dark:to-indigo-500/5">
                {project.bannerUrl ? (
                    <Image src={project.bannerUrl} alt={project.title} fill className="object-cover" />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <Folder className="w-6 h-6 text-violet-300 dark:text-violet-700" />
                    </div>
                )}
            </div>

            {/* Meta */}
            <div className="p-2.5 flex flex-col gap-1.5">
                <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate group-hover:text-orange transition-colors">
                    {project.title}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap">
                    {project.level && (
                        <span className={cn(
                            "text-[9px] font-medium px-1.5 py-px rounded-full",
                            LEVEL_COLORS[project.level] ?? "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                        )}>
                            {project.level.charAt(0) + project.level.slice(1).toLowerCase()}
                        </span>
                    )}
                    {project.workMode && (
                        <span className="text-[9px] text-neutral-400 dark:text-neutral-600">
                            {WORK_MODE_LABELS[project.workMode] ?? project.workMode}
                        </span>
                    )}
                </div>
                <p className="text-[9px] text-neutral-400 dark:text-neutral-600 truncate">
                    {getDisplayName(project.owner)}
                </p>
            </div>
        </Link>
    );
}
