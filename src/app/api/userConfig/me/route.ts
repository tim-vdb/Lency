import { UserConfigService } from "@/back/services/userConfig.service";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const configs = await UserConfigService.findUserConfigs();
        return NextResponse.json({ configs });
    } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
            return NextResponse.json({ error: error.message }, { status: 401 });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
