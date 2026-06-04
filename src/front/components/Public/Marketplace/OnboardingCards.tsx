import { Clapperboard, FolderPlus } from "lucide-react";

export function OnboardingProjectCard({ onAction }: { onAction: () => void }) {
    return (
        <div className="relative overflow-hidden rounded-[12px] border-2 border-dashed border-orange/40 bg-linear-to-br from-orange/5 via-white to-pink-50 p-6 flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center shrink-0">
                <FolderPlus className="w-6 h-6 text-orange" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-['Poppins',sans-serif] font-bold text-[15px] text-black">Publie ton premier projet</p>
                <p className="font-['Poppins',sans-serif] text-[12px] text-gray mt-0.5">Trouve tes collaborateurs sur la marketplace</p>
            </div>
            <button
                onClick={onAction}
                className="shrink-0 h-9 px-4 bg-orange text-white rounded-[7px] font-['Poppins',sans-serif] font-medium text-[13px] hover:bg-orange/90 transition-colors whitespace-nowrap"
            >
                Créer un projet
            </button>
        </div>
    );
}

export function OnboardingTalentCard({ onAction }: { onAction: () => void }) {
    return (
        <div className="relative overflow-hidden rounded-[12px] border-2 border-dashed border-orange/40 bg-linear-to-br from-orange/5 via-white to-pink-50 p-6 flex items-center gap-5">
            <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center shrink-0">
                <Clapperboard className="w-6 h-6 text-orange" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-['Poppins',sans-serif] font-bold text-[15px] text-black">Tu es dans l&apos;audiovisuel ?</p>
                <p className="font-['Poppins',sans-serif] text-[12px] text-gray mt-0.5">Rejoins la marketplace et fais-toi repérer</p>
            </div>
            <button
                onClick={onAction}
                className="shrink-0 h-9 px-4 bg-orange text-white rounded-[7px] font-['Poppins',sans-serif] font-medium text-[13px] hover:bg-orange/90 transition-colors whitespace-nowrap"
            >
                Créer mon profil
            </button>
        </div>
    );
}
