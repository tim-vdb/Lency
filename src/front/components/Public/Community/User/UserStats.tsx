import { UserProfile } from "@/front/types/user.schema";

export default function UserStats({ user }: { user: UserProfile }) {

    const stats = [
        { label: "Contributions", value: user._count.Posts },
        { label: "Abonnés", value: user._count.followers },
        { label: "Projets", value: user._count.projects },
    ];

    return (
        <div className="flex items-center gap-2 px-6">
            {stats.map((stat) => (
                <div
                    key={stat.label}
                    className="flex flex-col items-center bg-neutral-100 rounded-lg px-3 py-1.5 flex-1"
                >
                    <span className="text-sm font-semibold">{stat.value}</span>
                    <span className="text-xs text-neutral-500">{stat.label}</span>
                </div>
            ))}
        </div>
    );
}