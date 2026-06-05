export function EmptyState({ icon, title, subtitle, hasFilters, onReset }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    hasFilters: boolean;
    onReset: () => void;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="p-4 rounded-full bg-neutral-100">{icon}</div>
            <div className="text-center">
                <p className="font-['Poppins',sans-serif] font-semibold text-[#4c4a43]">{title}</p>
                <p className="font-['Poppins',sans-serif] text-sm text-gray mt-1">{subtitle}</p>
            </div>
            {hasFilters && (
                <button className="text-sm text-orange underline font-['Poppins',sans-serif]" onClick={onReset}>
                    Réinitialiser les filtres
                </button>
            )}
        </div>
    );
}
