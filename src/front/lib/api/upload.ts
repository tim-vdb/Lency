import { upload } from "@imagekit/next";

export async function uploadToImageKit(file: File, folder: string): Promise<string> {
    const authRes = await fetch("/api/imagekit/auth");
    if (!authRes.ok) throw new Error("Authentification upload échouée");
    const { signature, expire, token, publicKey } = await authRes.json();

    const uploaded = await upload({
        file,
        fileName: file.name,
        folder,
        signature,
        expire,
        token,
        publicKey,
    });

    if (!uploaded.url) throw new Error("URL manquante après upload");
    return uploaded.url;
}
