import { auth } from '@/back/lib/auth';
import { getUser } from '@/back/lib/auth-session';
import { sendPasswordChangedEmail } from '@/back/lib/send-password-changed-email';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });
        }

        const user = await getUser();
        if (!user) {
            return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
        }

        await auth.api.changePassword({
            body: { currentPassword, newPassword, revokeOtherSessions: false },
            headers: await headers(),
        });

        // Email de confirmation — non bloquant
        sendPasswordChangedEmail({
            email: user.email,
            firstName: user.firstname ?? null,
        }).catch((err) => {
            console.error('Failed to send password changed email:', err);
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.toLowerCase().includes('invalid password') || error.message.toLowerCase().includes('incorrect')) {
                return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 });
            }
            if (error.message.toLowerCase().includes('unauthorized') || error.message.toLowerCase().includes('session')) {
                return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
            }
        }
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
