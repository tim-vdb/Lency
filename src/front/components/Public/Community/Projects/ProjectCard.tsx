"use client";

import { Badge } from "@/front/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Project } from "@/back/generated/prisma_client";
import { timeAgo } from "@/front/lib/utils";

const STATUS_VARIANT: Record<string, string> = {
    PUBLISHED: "bg-emerald-100 text-emerald-700",
    DRAFT: "bg-neutral-100 text-neutral-700",
    ARCHIVED: "bg-amber-100 text-amber-700",
};

export default function ProjectCard({ project }: { project: Project }) {
    const statusClass = STATUS_VARIANT[project.status] ?? STATUS_VARIANT.DRAFT;

    return (
        <Card className="gap-2 py-3">
            <CardHeader className="pb-1 flex flex-row items-start justify-between">
                <CardTitle className="text-base">{project.title}</CardTitle>
                <Badge variant="secondary" className={`text-xs ${statusClass}`}>
                    {project.status}
                </Badge>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
                <p className="text-sm text-neutral-600 line-clamp-2">{project.description}</p>
                <span className="text-xs text-neutral-400">Il y a {timeAgo(project.createdAt)}</span>
            </CardContent>
        </Card>
    );
}
