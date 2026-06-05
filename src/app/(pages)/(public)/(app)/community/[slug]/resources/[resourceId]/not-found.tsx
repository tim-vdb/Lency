import Link from "next/link";
import { Button } from "@/front/components/ui/button";
import { FileXIcon } from "lucide-react";

export default function ResourceNotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 text-center">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
                <FileXIcon className="w-8 h-8 text-neutral-400" />
            </div>
            <div className="flex flex-col gap-2">
                <h2 className="text-xl font-semibold text-neutral-900">Ressource introuvable</h2>
                <p className="text-sm text-neutral-500">Cette ressource n'existe pas ou a été supprimée.</p>
            </div>
            <Button asChild variant="outline">
                <Link href="/community">Retour à la communauté</Link>
            </Button>
        </div>
    );
}
