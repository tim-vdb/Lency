import { getUploadAuthParams } from "@imagekit/next/server";
import { NextResponse } from "next/server";
import { getUser } from "@/back/lib/auth-session";

export async function GET() {
    const user = await getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
        return NextResponse.json(
            { error: "ImageKit keys are not configured" },
            { status: 500 }
        );
    }

    const { signature, expire, token } = getUploadAuthParams({ privateKey, publicKey });

    return NextResponse.json({ signature, expire, token, publicKey });
}
