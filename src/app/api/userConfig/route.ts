import { getUser } from "@/back/lib/auth-session";
import { UserConfigService } from "@/back/services/userConfig.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    const configs = await UserConfigService.findAllUserConfigs();

    return NextResponse.json({ configs });
}

export async function POST(req: NextRequest) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, content } = await req.json();

    const newConfig = await UserConfigService.createUserConfig(user.id, {
        title,
        content,
    });

    return NextResponse.json({ config: newConfig }, { status: 201 });
}