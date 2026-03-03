import { getUser } from "@/back/lib/auth-session";
import { ProjectsService } from "@/back/services/projects.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const data = await ProjectsService.findAllProjects();

    return NextResponse.json({ projects: data });
}

export async function POST(req: NextRequest) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, mapLocationId } = await req.json();

    const newProject = await ProjectsService.createProject(user.id, {
        title,
        description,
        mapLocationId,
    });

    return NextResponse.json({ project: newProject }, { status: 201 });
}