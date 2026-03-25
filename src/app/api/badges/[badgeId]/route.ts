import { BadgesService } from "@/back/services/badges.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET( req: NextRequest, { params }: { params: Promise<{ badgeId: string }> }) {
    const { badgeId } = await params;

    const data = await BadgesService.findByIdBadge(badgeId);

    return NextResponse.json({ badge: data });
}

export async function PATCH( req: NextRequest, { params }: { params: Promise<{ badgeId: string }> }) {
    const { badgeId } = await params;
    const data = await req.json();

    const updatedBadge = await BadgesService.updateBadge(badgeId, data);
    return NextResponse.json({ badge: updatedBadge });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ badgeId: string }> }) {
    const { badgeId } = await params;

    await BadgesService.deleteBadge(badgeId);

    return NextResponse.json({ message: `Badge ${badgeId} deleted`});
}