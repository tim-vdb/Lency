"use client";

import { Button } from "@/front/components/ui/button";
import { AlertCircleIcon, RotateCcwIcon } from "lucide-react";

type Props = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function AccountError({ reset }: Props) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                <AlertCircleIcon className="w-8 h-8 text-red-400" />
            </div>
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-neutral-900">Erreur dans votre espace</h2>
                <p className="text-sm text-neutral-500">Une erreur est survenue lors du chargement de votre espace.</p>
            </div>
            <Button variant="outline" onClick={reset}>
                <RotateCcwIcon className="w-4 h-4" />
                Réessayer
            </Button>
        </div>
    );
}
