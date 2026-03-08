
import { ProjectsService } from "@/back/services/projects.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params;
    const project = await ProjectsService.findByIdProject(projectId);
    if (!project) {
        return NextResponse.json({ error: "project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params;
    const data = await req.json();

    const updatedproject = await ProjectsService.updateProject(projectId, data);

    return NextResponse.json({ message: `project ${projectId} updated`, updatedproject });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
    const { projectId } = await params;
    await ProjectsService.deleteProject(projectId);
    return NextResponse.json({ message: `project ${projectId} deleted` });
}