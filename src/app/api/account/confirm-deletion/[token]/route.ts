import { UsersService } from "@/back/services/users.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;
        console.warn("[confirm-deletion] Received token:", token);

        if (!token) {
            console.warn("[confirm-deletion] No token provided");
            return NextResponse.json(
                { error: "Token manquant" },
                { status: 400 }
            );
        }

        console.warn("[confirm-deletion] Confirming deletion...");
        await UsersService.confirmDeleteUser(token);

        console.warn("[confirm-deletion] User deleted successfully");
        // Rediriger vers la homepage avec un message
        return NextResponse.redirect(
            new URL("/?deleted=success", req.nextUrl.origin),
            { status: 302 }
        );
    } catch (error) {
        console.error("[confirm-deletion] Error:", error);
        if (error instanceof Error) {
            if (error.message === "TOKEN_INVALID_OR_EXPIRED") {
                console.warn("[confirm-deletion] Token invalid or expired");
                return NextResponse.redirect(
                    new URL("/?deleted=expired", req.nextUrl.origin),
                    { status: 302 }
                );
            }
            if (error.message === "TOKEN_EXPIRED") {
                console.warn("[confirm-deletion] Token expired");
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
