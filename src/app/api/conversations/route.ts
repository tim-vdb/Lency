import { NextRequest, NextResponse } from "next/server";
import { ConversationService } from "@/back/services/conversations.service";

export async function GET() {
  try {
    const conversations = await ConversationService.getMyConversations();
    return NextResponse.json({ conversations });
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized")
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { otherUserId } = await req.json();
    if (!otherUserId) return NextResponse.json({ error: "otherUserId requis" }, { status: 400 });
    const conversation = await ConversationService.getOrCreateConversation(otherUserId);
    return NextResponse.json({ conversation });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      if (error.message === "Cannot DM yourself") return NextResponse.json({ error: "Impossible de vous écrire" }, { status: 400 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
