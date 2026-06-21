import { UsersService } from "@/back/services/users.service";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;
        const body = await req.json().catch(() => ({}));

        await UsersService.reportUser(userId, body.reason);

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Cannot report yourself") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
            if (error.message === "User not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }

        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
