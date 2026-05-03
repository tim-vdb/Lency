import { UsersService } from "@/back/services/users.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ userName: string }> }
) {
    try {
        const { userName } = await params;
        const data = await UsersService.findByUsername(userName);
        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error && error.message === "User not found") {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
