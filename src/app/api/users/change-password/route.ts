import { getUser } from '@/back/lib/auth-session';
import { sendPasswordChangeConfirmation } from '@/back/lib/send-password-change-confirmation';
import { UsersService } from '@/back/services/users.service';
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

        let rawToken: string;
        try {
            rawToken = await UsersService.initiatePasswordChange(user.id, currentPassword, newPassword);
        } catch (err) {
            if (err instanceof Error) {
                if (err.message === 'INVALID_PASSWORD') {
                    return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 });
                }
                if (err.message === 'NO_CREDENTIAL_ACCOUNT') {
                    return NextResponse.json({ error: 'Aucun compte avec mot de passe trouvé' }, { status: 400 });
                }
            }
            throw err;
        }

        sendPasswordChangeConfirmation({
            email: user.email,
            firstName: user.firstname,
            confirmationToken: rawToken,
        }).catch((err) => {
            console.error('Failed to send password change confirmation:', err);
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error in change-password:', error);
        return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
    }
}
