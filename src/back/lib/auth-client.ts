import { createAuthClient } from 'better-auth/react';
import { emailOTPClient, inferAdditionalFields } from 'better-auth/client/plugins';
import type { auth } from '@/back/lib/auth';

export const authClient = createAuthClient({
    plugins: [
        emailOTPClient(),
        inferAdditionalFields<typeof auth>(),
    ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
