import { UserConfigService } from "@/back/services/userConfig.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ configId: string }> }
) {
    try {
        const { configId } = await params;
        const data = await UserConfigService.findByIdUserConfig(configId);
        return NextResponse.json({ config: data });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "UserConfig not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ configId: string }> }
) {
    try {
        const { configId } = await params;
        const data = await req.json();
        const updatedConfig = await UserConfigService.updateUserConfig(configId, data);
        return NextResponse.json({ config: updatedConfig });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Forbidden") {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
            if (error.message === "UserConfig not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
            if (error.message === "No data to update") {
                return NextResponse.json({ error: error.message }, { status: 400 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ configId: string }> }
) {
    try {
        const { configId } = await params;
        await UserConfigService.deleteUserConfig(configId);
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "Unauthorized") {
                return NextResponse.json({ error: error.message }, { status: 401 });
            }
            if (error.message === "Forbidden") {
                return NextResponse.json({ error: error.message }, { status: 403 });
            }
            if (error.message === "UserConfig not found") {
                return NextResponse.json({ error: error.message }, { status: 404 });
            }
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}