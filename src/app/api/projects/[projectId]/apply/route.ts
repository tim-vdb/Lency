import { ProjectApplicationService } from "@/back/services/project-applications.service";
import { createApplicationSchema } from "@/back/schemas/zod/application.zod";
import { createZodRoute } from "next-zod-route";
import { NextResponse } from "next/server";
import { z } from "zod";

export const POST = createZodRoute()
    .params(z.object({ projectId: z.string() }))
    .body(createApplicationSchema)
    .handler(async (_req, { params, body }) => {
        try {
            const application = await ProjectApplicationService.apply(params.projectId, body);
            return NextResponse.json(
                { application, message: "Application submitted successfully" },
                { status: 201 }
            );
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Unauthorized")
                    return NextResponse.json({ error: "You must be logged in" }, { status: 401 });
                if (error.message === "Project not found")
                    return NextResponse.json({ error: "Project not found" }, { status: 404 });
                if (error.message === "Already applied to this project")
                    return NextResponse.json({ error: "You have already applied to this project" }, { status: 409 });
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
            return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
        }
    });
