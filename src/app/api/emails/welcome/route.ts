import { getUser } from '@/back/lib/auth-session';
import WelcomeEmail from '@/front/emails/WelcomeEmail';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { render } from '@react-email/components';

export async function POST() {
    const user = await getUser();

    try {
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        const html = await render(WelcomeEmail({ firstName: user?.name ?? undefined }));

        await transporter.sendMail({
            from: `Lency <${process.env.SMTP_FROM ?? 'welcome@infos.lency.net'}>`,
            to: 'amyvdb16@gmail.com',
            subject: "Bienvenue chez Lency ! La plateforme communautaire pour les passionnés d'audio/visuel",
            html,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

// import { Resend } from 'resend';
// const resend = new Resend(process.env.RESEND_API_KEY);
//
// export async function POST() {
//     const user = await getUser();
//
//     try {
//         const { data, error } = await resend.emails.send({
//             from: 'Lency <welcome@infos.lency.net>',
//             to: ['amyvdb16@gmail.com'],
//             subject: "Bienvenue chez Lency ! La plateforme communautaire pour les passionnés d'audio/visuel",
//             react: WelcomeEmail({ firstName: user?.name ?? undefined }),
//         });
//
//         if (error) {
//             return (
//                 NextResponse.json({ error }, { status: 500 }),
//                 console.error(error.message)
//             )
//         }
//
//         return NextResponse.json(data);
//     } catch (error) {
//         return NextResponse.json({ error }, { status: 500 });
//     }
// }