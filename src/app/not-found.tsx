import Link from "next/link";
import { Button } from "@/front/components/ui/button";
import { ArrowLeftIcon, SearchXIcon } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-6">
                        <SearchXIcon className="w-8 h-8 text-neutral-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-3">Page introuvable</h1>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Cette page n'existe pas ou a été déplacée.
                    </p>
                    <Button asChild className="w-full">
                        <Link href="/">
                            <ArrowLeftIcon className="w-4 h-4" />
                            Retour à l'accueil
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
