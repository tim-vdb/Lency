import { ProjectsService } from "@/back/services/projects.service";
import { CreateProjectInput, createProjectSchema } from "@/back/schemas/zod/project.zod";
import { createZodRoute } from "next-zod-route";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const data = await ProjectsService.findAllProjects();
        return NextResponse.json({ projects: data });
    } catch {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export const POST = createZodRoute()
     .body(createProjectSchema)
    .handler(async (_req, { body }) => {
        try {
            const newProject = await ProjectsService.createProject(body);
            revalidatePath("/marketplace");
            revalidatePath("/user", "layout");
            return NextResponse.json({ project: newProject }, { status: 201 });
        } catch (error) {
            if (error instanceof Error) {
                console.error("[POST /api/projects] Error:", error.message, error.stack);
                if (error.message === "Unauthorized")
                    return NextResponse.json({ error: error.message }, { status: 401 });
                return NextResponse.json({ error: error.message }, { status: 500 });
            }
            console.error("[POST /api/projects] Unknown error:", error);
            return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
        }
    });
