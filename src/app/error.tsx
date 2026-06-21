"use client";

import Link from "next/link";
import { Button } from "@/front/components/ui/button";
import { AlertCircleIcon, ArrowLeftIcon, RotateCcwIcon } from "lucide-react";

type Props = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function GlobalError({ error: _error, reset }: Props) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <AlertCircleIcon className="w-8 h-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-neutral-900 mb-3">Une erreur est survenue</h1>
                    <p className="text-neutral-600 mb-8 leading-relaxed">
                        Quelque chose s'est mal passé. Vous pouvez réessayer ou revenir à l'accueil.
                    </p>
                    <div className="flex flex-col gap-2">
                        <Button onClick={reset} className="w-full">
                            <RotateCcwIcon className="w-4 h-4" />
                            Réessayer
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/">
                                <ArrowLeftIcon className="w-4 h-4" />
                                Retour à l'accueil
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
