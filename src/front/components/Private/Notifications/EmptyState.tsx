import { Bell } from "lucide-react";

interface EmptyStateProps {
    icon?: React.ReactNode;
    message?: string;
}

export function EmptyState({ icon, message }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center h-full py-12 gap-3">
            {icon ?? <Bell className="w-12 h-12 text-neutral-200" />}
            <p className="text-sm text-neutral-400">{message ?? "Aucune notification pour le moment"}</p>
        </div>
    );
}
