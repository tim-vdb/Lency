import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/back/lib/auth-session";
import { ably } from "@/back/lib/ably";

/**
 * Générer un token Ably pour le client
 * Le client peut ensuite s'authentifier sans exposer la clé API
 */
export async function GET(_req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      console.error("[Ably Token] Unauthorized - no user");
      return NextResponse.json(
        { error: "You must be logged in" },
        { status: 401 }
      );
    }

    console.error("[Ably Token] Generating token for user:", user.id);

    // Générer un token request Ably avec le user ID comme clientId
    // Cela permet à Ably de tracker quel utilisateur envoie les messages
    const tokenRequest = await ably.auth.createTokenRequest({
      clientId: user.id,
      ttl: 1000 * 60 * 60, // 1 hour
    });

    console.error("[Ably Token] Token request generated:", {
      clientId: tokenRequest.clientId,
      keyName: tokenRequest.keyName,
      ttl: tokenRequest.ttl,
    });

    // Ably's authUrl expects the TokenRequest returned directly, NOT wrapped in an object
    return NextResponse.json(tokenRequest);
  } catch (error) {
    console.error("[Ably Token] Error generating Ably token:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}
