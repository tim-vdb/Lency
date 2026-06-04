import { NextResponse } from "next/server";
import { NotificationService } from "@/back/services/notifications.service";

export async function GET() {
  try {
    const notifications = await NotificationService.getMyNotifications();
    return NextResponse.json({ notifications });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized")
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
