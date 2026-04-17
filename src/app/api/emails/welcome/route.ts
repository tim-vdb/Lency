import { getUser } from '@/back/lib/auth-session';
import WelcomeEmail from '@/front/emails/WelcomeEmail';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(): Promise<NextResponse> {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const user = await getUser();
    const userEmail = user?.email;

    if (!userEmail) {
        return NextResponse.json({ error: 'Email utilisateur introuvable.' }, { status: 400 });
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'Lency <welcome@infos.lency.net>',
            to: [userEmail],
            subject: "Bienvenue chez Lency ! La plateforme communautaire pour les passionnés d'audiovisuel",
            react: WelcomeEmail({ firstName: user?.firstname ?? null }),
        });

        if (error) {
            console.error(error.message);
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

// import nodemailer from 'nodemailer';
// import { render } from '@react-email/components';

// export async function POST() {
//     const user = await getUser();

//     try {
//         const transporter = nodemailer.createTransport({
//             host: process.env.SMTP_HOST,
//             port: Number(process.env.SMTP_PORT) || 587,
//             secure: process.env.SMTP_SECURE === 'true',
//             auth: {
//                 user: process.env.SMTP_USER,
//                 pass: process.env.SMTP_PASSWORD,
//             },
//         });

//         const html = await render(WelcomeEmail({ firstName: user?.name ?? undefined }));

//         await transporter.sendMail({
//             from: `Lency <${process.env.SMTP_FROM ?? 'welcome@infos.lency.net'}>`,
//             to: 'timotheevdbosch@gmail.com',
//             subject: "Bienvenue chez Lency ! La plateforme communautaire pour les passionnés d'audiovisuel",
//             html,
//         });

//         return NextResponse.json({ success: true });
//     } catch (error) {
//         return NextResponse.json({ error }, { status: 500 });
//     }
// }