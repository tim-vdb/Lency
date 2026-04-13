import { MailsService } from "@/back/services/mails.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const mails = await MailsService.findAllMails();
        return NextResponse.json({ mails });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Forbidden") {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newMail = await MailsService.createMail(data);
        return NextResponse.json({ mail: newMail }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            if ([
                "Prénom invalide",
                "Nom invalide",
                "Email invalide",
                "Sujet trop court",
                "Message trop court",
            ].includes(error.message)) {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}