import { UserConfigService } from "@/back/services/userConfig.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ configId: string }> }) {
    const { configId } = await params;

    const data = await UserConfigService.findByIdUserConfig(configId);

    return NextResponse.json({ config: data });
}

export async function PATCH(req: NextRequest,{ params }: { params: Promise<{ configId: string }> }) {
    const { configId } = await params;
    const data = await req.json();

    const updatedUserConfig = await UserConfigService.updateUserConfig(configId, data);
    return NextResponse.json({ config: updatedUserConfig });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ configId: string }> }) {
    const { configId } = await params;

    await UserConfigService.deleteUserConfig(configId);

    return NextResponse.json({message: `Config ${configId} deleted`,});
}