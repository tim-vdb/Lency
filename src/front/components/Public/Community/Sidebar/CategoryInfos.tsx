"use client";

import { PostWithAuthorAndCategory } from "@/front/types/post.schema";
import { PencilRuler } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/fr";
import { Card } from "@/front/components/ui/card";
import Link from "next/link";
dayjs.locale("fr");

export default function CategoryInfos({ post }: { post: PostWithAuthorAndCategory }) {
    const stats = [
        { label: post.category.members === 1 ? 'membre' : 'membres', value: post.category.members },
        { label: "Abonnés", value: 120 },
        { label: "Projets", value: 120 },
    ]

    return (
        <Card className="p-4 flex flex-col gap-2 shadow-none">
            <Link href={`/community/${post.category.slug}`} className="text-lg font-semibold hover:underline">
                <h2 className="text-base text-neutral-500">{post.category.name}</h2>
            </Link>
            <p className="text-xs text-muted-foreground">{post.category.description}</p>
            <div className="flex items-center w-full justify-center gap-4 rounded-md">
                {stats.map((stat, index) => (
                    <div key={index} className="flex flex-col items-center bg-neutral-100 rounded-lg p-2">
                        <span>{stat.value}</span>
                        <p className="text-xs">{stat.label}</p>
                    </div>
                ))}
            </div>
            <span className="text-base"></span>
            <span className="flex items-center gap-2">
                <PencilRuler className="w-4 h-4" />
                <span className="text-xs">Créée le {dayjs(post.category.createdAt).format('DD MMMM YYYY')}</span>
            </span>
        </Card>
    );
}