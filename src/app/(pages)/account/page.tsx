import { Metadata } from "next";
import { DashboardFeaturedProjects } from "@/front/components/Private/Account/Dashboard/DashboardFeaturedProjects";
import { DashboardTabs } from "@/front/components/Private/Account/Dashboard/DashboardTabs";
import { DashboardNotifications } from "@/front/components/Private/Account/Dashboard/DashboardNotifications";

export const metadata: Metadata = {
    title: "Dashboard — Lency",
    robots: { index: false, follow: false },
};

export default function DashboardAccount() {
    return (
        <div className="flex flex-col bg-[#F7F7F2] dark:bg-neutral-950 w-full pb-4 md:pb-0 md:overflow-hidden md:h-full min-h-full" style={{ padding: "12px 12px 0 12px", gap: "24px" }}>

            {/* ── Projet à la Une ── */}
            <DashboardFeaturedProjects
                className="shrink-0 w-full"
                style={{ height: "clamp(180px, calc((100vh - 128px) * 0.283), 300px)" }}
            />

            {/* ── Tabs + Notifications ── */}
            <div className="flex flex-col md:flex-row md:flex-1 md:overflow-hidden min-h-0 w-full" style={{ gap: "16px" }}>
                {/* Tabs */}
                <div
                    className="flex-1 bg-white dark:bg-neutral-900 rounded-xl border border-[#E8E8E1] dark:border-neutral-700 overflow-hidden flex flex-col min-h-[480px] md:min-h-0 w-full"
                    style={{ padding: "20px 24px" }}
                >
                    <DashboardTabs className="flex-1 flex flex-col overflow-hidden w-full" />
                </div>

                {/* Notifications — caché sur mobile, accessible via la cloche du header */}
                <div className="hidden md:block w-full md:shrink-0 md:min-h-0 md:w-[clamp(240px,calc(27.9vw-67px),329px)]">
                    <DashboardNotifications className="h-full w-full" />
                </div>
            </div>
        </div>
    );
}
