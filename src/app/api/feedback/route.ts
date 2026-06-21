import { FeedbackService } from "@/back/services/feedback.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const feedbacks = await FeedbackService.findAll();
        return NextResponse.json({ feedbacks });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const feedback = await FeedbackService.create(data);
        return NextResponse.json({ feedback }, { status: 201 });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized")
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}
