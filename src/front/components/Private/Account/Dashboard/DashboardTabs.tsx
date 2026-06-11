"use client";

import { useState } from "react";
import { Maximize2, X } from "lucide-react";
import { cn } from "@/front/lib/utils";
import { Button } from "@/front/components/ui/button";
import { DashboardCommunities } from "./DashboardCommunities";
import { DashboardExplorer } from "./DashboardExplorer";

type MainTab = "communautes" | "explorer";
type ExplorerMode = "projets" | "talents";

const MAIN_TABS: { id: MainTab; label: string }[] = [
    { id: "communautes", label: "Communautés" },
    { id: "explorer", label: "Explorer & Marketplace" },
];

const EXPLORER_MODES: { id: ExplorerMode; label: string }[] = [
    { id: "projets", label: "Projets" },
    { id: "talents", label: "Talents" },
];

export function DashboardTabs({ className }: { className?: string }) {
    const [activeTab, setActiveTab] = useState<MainTab>("communautes");
    const [explorerMode, setExplorerMode] = useState<ExplorerMode>("projets");
    const [expanded, setExpanded] = useState(false);

    /* ── Fullscreen overlay pour Communautés / Marketplace ── */
    if (expanded && activeTab !== "explorer") {
        const label = MAIN_TABS.find((t) => t.id === activeTab)?.label ?? "";
        return (
            <div className="fixed inset-0 z-50 bg-white dark:bg-neutral-950 flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 shrink-0">
                    <h2 className="text-lg font-semibold">{label}</h2>
                    <Button variant="ghost" size="icon" onClick={() => setExpanded(false)}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                    {activeTab === "communautes" && <DashboardCommunities />}
                </div>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col", className)}>
            {/* Header row */}
            <div className="flex items-center gap-3 shrink-0">
                {/* Main tab bar — style segmented control */}
                <div className="flex items-center bg-[#F7F7F2] rounded-lg p-1 gap-0.5">
                    {MAIN_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "px-5 py-2 rounded-lg text-[14px] font-medium transition-colors cursor-pointer whitespace-nowrap leading-none",
                                activeTab === tab.id
                                    ? "bg-[#000000] text-white shadow-sm"
                                    : "text-[#000000] hover:bg-[#E8E8E1]"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Explorer sub-tabs — uniquement si Explorer actif */}
                {activeTab === "explorer" && (
                    <div className="flex items-center bg-[#F7F7F2] rounded-lg p-1 gap-0.5">
                        {EXPLORER_MODES.map((m) => (
                            <button
                                key={m.id}
                                onClick={() => setExplorerMode(m.id)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-[14px] font-medium transition-colors cursor-pointer whitespace-nowrap leading-none",
                                    explorerMode === m.id
                                        ? "bg-[#EA3D0E] text-white shadow-sm"
                                        : "text-[#000000] hover:bg-[#E8E8E1]"
                                )}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Expand — toujours à droite */}
                <button
                    onClick={() => setExpanded(true)}
                    className="ml-auto p-1.5 hover:bg-[#F7F7F2] rounded-lg cursor-pointer transition-colors"
                >
                    <Maximize2 className="w-4 h-4 text-[#8C8A85]" />
                </button>
            </div>

            {/* Content — flex-col pour que chaque onglet puisse utiliser flex-1 */}
            <div className="flex-1 min-h-0 mt-4 flex flex-col overflow-hidden">
                {activeTab === "communautes" && (
                    <div className="flex-1 min-h-0 overflow-y-auto">
                        <DashboardCommunities />
                    </div>
                )}
                {activeTab === "explorer" && (
                    <DashboardExplorer
                        mode={explorerMode}
                        expanded={expanded}
                        onExpand={() => setExpanded(true)}
                        onCollapse={() => setExpanded(false)}
                    />
                )}
            </div>
        </div>
    );
}
