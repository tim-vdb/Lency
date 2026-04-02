import { BadgesService } from "@/back/services/badges.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ badgeId: string }> }
) {
    try {
        const { badgeId } = await params;
        const data = await BadgesService.findByIdBadge(badgeId);
        return NextResponse.json({ badge: data });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Badge not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ badgeId: string }> }
) {
    try {
        const { badgeId } = await params;
        const data = await req.json();
        const updatedBadge = await BadgesService.updateBadge(badgeId, data);
        return NextResponse.json({ badge: updatedBadge });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Badge not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            if (error.message === "No data to update") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ badgeId: string }> }
) {
    try {
        const { badgeId } = await params;
        await BadgesService.deleteBadge(badgeId);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Badge not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}