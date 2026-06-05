import type { Metadata } from "next";
import LencyLogo from "@/front/components/ui/lency-logo";

export const metadata: Metadata = {
    title: "Maintenance — Lency",
    description: "Lency est temporairement en maintenance. Nous revenons très bientôt.",
    robots: { index: false, follow: false },
};

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
            <div className="flex flex-col items-center gap-8 max-w-md w-full text-center">

                <LencyLogo className="h-10 w-auto" />

                <div className="flex flex-col gap-3">
                    <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
                        Site en maintenance
                    </h1>
                    <p className="text-zinc-500 text-base leading-relaxed">
                        Nous effectuons des améliorations pour vous offrir une meilleure expérience.
                        Merci de revenir plus tard.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
                    Travaux en cours
                </div>
            </div>
        </div>
    );
}
