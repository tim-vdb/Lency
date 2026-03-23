import { getUser } from "@/back/lib/auth-session";
import { UserConfigService } from "@/back/services/userConfig.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ configId: string }> }
) {
    const { configId } = await params;

    const config = await UserConfigService.findByIdUserConfig(configId);

    if (!config) {
        return NextResponse.json({ error: "Config not found" }, { status: 404 });
    }

    return NextResponse.json({ config });
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ configId: string }> }
) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { configId } = await params;
    const data = await req.json();

    const config = await UserConfigService.findByIdUserConfig(configId);

    if (!config) {
        return NextResponse.json({ error: "Config not found" }, { status: 404 });
    }

    if (config.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updated = await UserConfigService.updateUserConfig(configId, data);

    return NextResponse.json({ config: updated });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ configId: string }> }
) {
    const user = await getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { configId } = await params;

    const config = await UserConfigService.findByIdUserConfig(configId);

    if (!config) {
        return NextResponse.json({ error: "Config not found" }, { status: 404 });
    }

    if (config.userId !== user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await UserConfigService.deleteUserConfig(configId);

    return NextResponse.json({
        message: `Config ${configId} deleted`,
    });
}