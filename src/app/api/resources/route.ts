import { getUser } from "@/back/lib/auth-session";
import { ResourcesService } from "@/back/services/resources.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const resources = await ResourcesService.findAllResources();

    return NextResponse.json({ resources });
}

export async function POST(req: NextRequest) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, type, url, categoryId } = await req.json();

    const newResource = await ResourcesService.createResource({
        title,
        description,
        type,
        url,
        categoryId,
    });

    return NextResponse.json({ resource: newResource }, { status: 201 });
}