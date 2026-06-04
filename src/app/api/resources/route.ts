import { ResourcesService } from "@/back/services/resources.service";
import { createResourceSchema } from "@/back/schemas/zod/resource.zod";
import { createZodRoute } from "next-zod-route";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const categoryId = req.nextUrl.searchParams.get("categoryId") ?? undefined;
        const authorId = req.nextUrl.searchParams.get("authorId") ?? undefined;
        const resources = await ResourcesService.findAllResources({ categoryId, authorId });
        return NextResponse.json({ resources });
    } catch {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export const POST = createZodRoute()
    .body(createResourceSchema)
    .handler(async (_req, { body }) => {
        try {
            const newResource = await ResourcesService.createResource(body);
            revalidatePath("/community", "layout");
            revalidatePath("/user", "layout");
            return NextResponse.json({ resource: newResource }, { status: 201 });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Unauthorized")
                    return NextResponse.json({ error: error.message }, { status: 401 });
            }
            console.error("[POST /api/resources]", error);
            return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
        }
    });
