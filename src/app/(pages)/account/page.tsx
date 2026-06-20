import { Metadata } from "next";
import { DashboardFeaturedProjects } from "@/front/components/Private/Account/Dashboard/DashboardFeaturedProjects";
import { DashboardTabs } from "@/front/components/Private/Account/Dashboard/DashboardTabs";
import { DashboardNotifications } from "@/front/components/Private/Account/Dashboard/DashboardNotifications";

export const metadata: Metadata = {
    title: "Dashboard — Lency",
    robots: { index: false, follow: false },
};

/*
  Calcul des hauteurs depuis les specs du design (artboard 2738px @2x → viewport cible ~1369px) :

  Contenu dispo  = 100vh − 80px (nav) − 12px (pt) − 12px (pb) − 24px (gap) = 100vh − 128px
  Featured       = 257 / (257 + 651) = 28.3 % → h = calc((100vh - 128px) * 0.283)
                   Sur 1080p : (1080-128) * 0.283 = 269px  ≈ 257px ✓
                   Clampé   : min 180px, max 300px
  Tabs           = flex-1 (prend le reste, ~651px sur 1080p)

  Notifications  = 329 / 1177 (contenu - sidebar 215px - padding 24px) ≈ 27.9%
                   → calc(27.9vw - 67px), clampé 240px→329px
                   Sur 1440px : 27.9*1440 - 67 = 334px → capé à 329px ✓
*/
export default function DashboardAccount() {
    return (
        <div
            className="flex flex-col overflow-hidden bg-[#F7F7F2] dark:bg-neutral-950 h-full w-full"
            style={{ padding: "12px 12px 0 12px", gap: "24px" }}
        >
            {/* ── Projet à la Une ── */}
            <DashboardFeaturedProjects
                className="shrink-0 w-full"
                style={{ height: "clamp(180px, calc((100vh - 128px) * 0.283), 300px)"}}
            />

            {/* ── Tabs + Notifications ── */}
            <div className="flex flex-1 overflow-hidden min-h-0 w-full" style={{ gap: "16px" }}>
                {/* Tabs : flex-1 → prend toute la largeur restante */}
                <div
                    className="flex-1 bg-white dark:bg-neutral-900 rounded-xl border border-[#E8E8E1] dark:border-neutral-700 overflow-hidden flex flex-col min-w-0 w-full"
                    style={{ padding: "20px 24px" }}
                >
                    <DashboardTabs className="flex-1 flex flex-col overflow-hidden w-full" />
                </div>

                {/* Notifications : largeur proportionnelle à la spec (329px sur 1440px) */}
                <DashboardNotifications
                    className="w-full"
                    style={{ width: "clamp(240px, calc(27.9vw - 67px), 329px)", flexShrink: 0 }}
                />
            </div>
        </div>
    );
}
