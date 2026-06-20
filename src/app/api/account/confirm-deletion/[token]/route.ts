import { UsersService } from "@/back/services/users.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

        if (!token) {
            return NextResponse.json(
                { error: "Token manquant" },
                { status: 400 }
            );
        }

        await UsersService.confirmDeleteUser(token);

        // Rediriger vers la homepage avec un message
        return NextResponse.redirect(
            new URL("/?deleted=success", req.nextUrl.origin),
            { status: 302 }
        );
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "TOKEN_INVALID_OR_EXPIRED") {
                return NextResponse.redirect(
                    new URL("/?deleted=expired", req.nextUrl.origin),
                    { status: 302 }
                );
            }
            if (error.message === "TOKEN_EXPIRED") {
                return NextResponse.redirect(
                    new URL("/?deleted=expired", req.nextUrl.origin),
                    { status: 302 }
                );
            }
        }
        return NextResponse.redirect(
            new URL("/?deleted=error", req.nextUrl.origin),
            { status: 302 }
        );
    }
}
