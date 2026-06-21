import { NextRequest, NextResponse } from "next/server";
import { ConversationService } from "@/back/services/conversations.service";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const messages = await ConversationService.getMessages(id);
    return NextResponse.json({ messages });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      if (error.message === "Forbidden") return NextResponse.json({ error: "Interdit" }, { status: 403 });
      if (error.message === "Not found") return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content, activeChatConversationId, imageUrls, audioUrls, videoUrls } = await req.json();
    if (!content?.trim() && !imageUrls?.length && !audioUrls?.length && !videoUrls?.length)
      return NextResponse.json({ error: "Contenu requis" }, { status: 400 });
    const message = await ConversationService.sendMessage(id, content ?? "", activeChatConversationId, { imageUrls, audioUrls, videoUrls });
    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "Unauthorized") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      if (error.message === "Forbidden") return NextResponse.json({ error: "Interdit" }, { status: 403 });
      if (error.message === "Not found") return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
