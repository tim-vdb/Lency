import { UsersService } from "@/back/services/users.service";
import { updateUserSchema } from "@/back/schemas/zod/user.zod";
import { createZodRoute } from "next-zod-route";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;
        const data = await UsersService.findByIdUser(userId);
        return NextResponse.json(data);
    } catch (error) {
        if (error instanceof Error && error.message === "User not found")
            return NextResponse.json({ error: error.message }, { status: 404 });
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export const PATCH = createZodRoute()
    .params(z.object({ userId: z.string() }))
    .body(updateUserSchema)
    .handler(async (_req, { params, body }) => {
        try {
            const updatedUser = await UsersService.updateUser(params.userId, body);
            revalidatePath("/user", "layout");
            revalidatePath("/marketplace", "layout");
            return NextResponse.json({ user: updatedUser });
        } catch (error) {
            if (error instanceof Error) {
                if (error.message === "Unauthorized")
                    return NextResponse.json({ error: error.message }, { status: 401 });
                if (error.message === "Forbidden")
                    return NextResponse.json({ error: error.message }, { status: 403 });
                if (error.message === "User not found")
                    return NextResponse.json({ error: error.message }, { status: 404 });
            }
            return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
        }
    });

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
            if (error.message === "Unauthorized")
                return NextResponse.json({ error: error.message }, { status: 401 });
            if (error.message === "User not found")
                return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
