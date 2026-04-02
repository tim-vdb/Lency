import { UserConfigService } from "@/back/services/userConfig.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const configs = await UserConfigService.findAllUserConfigs();
        return NextResponse.json({ configs });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const data = await req.json();
        const newConfig = await UserConfigService.createUserConfig(data);
        return NextResponse.json({ config: newConfig }, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Title is required" || error.message === "Content is required") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}