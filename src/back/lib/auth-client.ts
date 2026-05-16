import { createAuthClient } from 'better-auth/react';
import { emailOTPClient, inferAdditionalFields } from 'better-auth/client/plugins';
import type { auth } from '@/back/lib/auth';

export const authClient = createAuthClient({
    /** The base URL of the server (optional if you're using the same domain) */
    baseURL: process.env.BASE_URL,
    plugins: [
        emailOTPClient(),
        inferAdditionalFields<typeof auth>(),
    ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
