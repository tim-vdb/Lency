import { getUser } from '@/back/lib/auth-session';
import WelcomeEmail from '@/front/emails/WelcomeEmail';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
    const user = await getUser();

    try {
        const { data, error } = await resend.emails.send({
            from: 'Lency <welcome@infos.lency.net>',
            to: ['amyvdb16@gmail.com'],
            subject: "Bienvenue chez Lency ! La plateforme communautaire pour les passionnés d'audio/visuel",
            react: WelcomeEmail({ firstName: user?.name ?? undefined }),
        });

        if (error) {
            return (
                NextResponse.json({ error }, { status: 500 }),
                console.error(error.message)
            )
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}