"use client";

import { useState } from "react";
import { Maximize2 } from "lucide-react";
import { cn } from "@/front/lib/utils";
import { DashboardCommunities } from "./DashboardCommunities";
import { DashboardExplorer } from "./DashboardExplorer";

type MainTab = "communautes" | "marketplace" | "explorer";
type ExplorerMode = "projets" | "talents";

const MAIN_TABS: { id: MainTab; label: string }[] = [
    { id: "communautes", label: "Communautés" },
    { id: "marketplace", label: "Marketplace" },
    { id: "explorer", label: "Explorer" },
];

const EXPLORER_MODES: { id: ExplorerMode; label: string }[] = [
    { id: "projets", label: "Projets" },
    { id: "talents", label: "Talents" },
];

export function DashboardTabs({ className }: { className?: string }) {
    const [activeTab, setActiveTab] = useState<MainTab>("communautes");
    const [explorerMode, setExplorerMode] = useState<ExplorerMode>("projets");
    const [mapExpanded, setMapExpanded] = useState(false);

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
                    onClick={() => setMapExpanded(true)}
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
                {activeTab === "marketplace" && (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-sm text-[#8C8A85]">Marketplace — bientôt disponible</p>
                    </div>
                )}
                {activeTab === "explorer" && (
                    <DashboardExplorer
                        mode={explorerMode}
                        expanded={mapExpanded}
                        onExpand={() => setMapExpanded(true)}
                        onCollapse={() => setMapExpanded(false)}
                    />
                )}
            </div>
        </div>
    );
}
