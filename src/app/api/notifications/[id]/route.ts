import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/back/services/notifications.service";

export async function PATCH(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const notification = await NotificationService.markAsRead(id);
    return NextResponse.json({ notification });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized")
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await NotificationService.dismiss(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized")
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
