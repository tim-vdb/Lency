import { UserProfile } from "@/front/schemas/types/user.type";

function formatStat(n: number): string {
    if (n >= 1000) return `${Math.floor(n / 1000)}K`;
    if (n < 10) return `0${n}`;
    return String(n);
}

export default function UserStats({ user }: { user: UserProfile }) {
    const stats = [
        { label: "Contributions", value: user._count.Posts },
        { label: "Abonnés", value: user._count.followers },
        { label: "Projets", value: user._count.projects },
    ];

    return (
        <div className="flex items-center justify-around flex-1 py-4">
            {stats.map((stat) => (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                    <span className="text-5xl font-black text-orange leading-none tabular-nums">
                        {formatStat(stat.value)}
                    </span>
                    <span className="text-2xl font-bold text-foreground mt-1">{stat.label}</span>
                </div>
            ))}
        </div>
    );
}
