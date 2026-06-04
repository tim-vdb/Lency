import { UsersService } from "@/back/services/users.service";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        const data = await UsersService.findByIdUser(userId);

        return NextResponse.json(data);

    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "User not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;
        const data = await req.json();

        const updatedUser = await UsersService.updateUser(userId, data);
        revalidatePath("/user", "layout");
        revalidatePath("/marketplace", "layout");
        return NextResponse.json({ user: updatedUser });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Forbidden") {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
            if (error.message === "User not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            if (error.message === "No data to update") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
            console.error("[PATCH /api/users] Unhandled error:", error.message, error.stack);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
        console.error("[PATCH /api/users] Unknown error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;

        await UsersService.deleteUser(userId);
        
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "User not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}