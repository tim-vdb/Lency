'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Button } from '@/front/components/ui/button';
import { Input } from '@/front/components/ui/input';
import useEmailOtp from '@/front/hooks/use-email-otp';
import useSendEmail from '@/front/hooks/use-send-email';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function VerifyEmailContent() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialEmail = useMemo(() => searchParams.get('email') ?? '', [searchParams]);
    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const { sendVerificationOtp, verifyEmailOtp } = useEmailOtp();
    const { sendEmail } = useSendEmail('/api/emails/welcome');

    async function resendOtp() {
        if (!email) {
            toast.error('L\'email est requis.');
            return;
        }

        setIsSending(true);
        try {
            const result = await sendVerificationOtp(email, 'email-verification');

            if (!result) {
                toast.error('Impossible d\'envoyer le code de vérification.');
                return;
            }

            toast.success('Code de vérification envoyé.');
        } finally {
            setIsSending(false);
        }
    }

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!email || !otp) {
            toast.error('Email et code OTP requis.');
            return;
        }

        setIsVerifying(true);
        try {
            const result = await verifyEmailOtp(email, otp);

            if (!result) {
                toast.error('Code OTP invalide ou expiré.');
                return;
            }

            toast.success('Email vérifié avec succès.');

            const welcomeResult = await sendEmail({
                email: email,
            });

            if (!welcomeResult) {
                toast.error("Compte créé mais l'email de bienvenue n'a pas pu être envoyé.");
            }
            router.push('/');
            router.refresh();
        } finally {
            setIsVerifying(false);
        }
    }

    return (
        <div className="container flex items-center justify-center h-[calc(100vh-5rem)]">
            <div className="bg-white dark:bg-zinc-900 border-4 border-zinc-200 dark:border-zinc-700 rounded-3xl p-10 w-full max-w-md shadow-lg">
                <div className="text-center mb-8">
                    <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 font-inter">Vérifier l'email</p>
                    <h2 className="text-4xl leading-tight text-zinc-950 dark:text-white">Confirmer votre adresse email</h2>
                    <p className="font-inter text-sm text-zinc-600 dark:text-zinc-300 mt-3">Entrez le code OTP envoyé à votre adresse.</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4 font-inter">
                    <Input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="example@mail.com"
                        disabled
                        className='disabled:pointer-events-auto border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400'
                    />

                    <Input
                        value={otp}
                        onChange={(event) => setOtp(event.target.value)}
                        placeholder="123456"
                        maxLength={8}
                        className='border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400'
                    />

                    <Button type="submit" disabled={isVerifying} className="rounded-md bg-zinc-900 dark:bg-orange-600 text-white dark:text-white py-3 uppercase tracking-[0.2em] text-xs font-semibold transition hover:bg-zinc-800 dark:hover:bg-orange-700">
                        {isVerifying ? <Loader2 size={16} className="animate-spin" /> : 'Vérifier'}
                    </Button>

                    <Button type="button" variant="outline" onClick={resendOtp} disabled={isSending || !email} className="border-zinc-300 dark:border-zinc-600 text-zinc-800 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        {isSending ? <Loader2 size={16} className="animate-spin" /> : 'Renvoyer le code'}
                    </Button>

                    <p className="text-center text-xs text-zinc-600 dark:text-zinc-400">
                        <Link href="/login" className="underline hover:text-zinc-800 dark:hover:text-zinc-200">Retour à la connexion</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
