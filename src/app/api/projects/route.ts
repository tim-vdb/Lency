import { ProjectsService } from "@/back/services/projects.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await ProjectsService.findAllProjects();
        return NextResponse.json({ projects: data });
    } catch {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newProject = await ProjectsService.createProject(data);
        return NextResponse.json({ project: newProject }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if ([
                "Title is required",
                "Description is required",
            ].includes(error.message)) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}