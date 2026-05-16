import { UsersService } from "@/back/services/users.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { platform, url } = await req.json();
        if (!platform || !url) {
            return NextResponse.json({ error: "platform and url are required" }, { status: 400 });
        }
        const link = await UsersService.upsertSocialLink(platform, url);
        return NextResponse.json({ link }, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { platform } = await req.json();
        if (!platform) {
            return NextResponse.json({ error: "platform is required" }, { status: 400 });
        }
        await UsersService.deleteSocialLink(platform);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
