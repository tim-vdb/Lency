'use client';

import { FormEvent, useMemo, useState } from 'react';
import { Button } from '@/front/components/ui/button';
import { Input } from '@/front/components/ui/input';
import useEmailOtp from '@/front/hooks/use-email-otp';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export default function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { resetPasswordWithOtp } = useEmailOtp();

    const initialEmail = useMemo(() => searchParams.get('email') ?? '', [searchParams]);

    const [email, setEmail] = useState(initialEmail);
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!email || !otp || !password || !confirmPassword) {
            toast.error('Tous les champs sont requis.');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Les mots de passe ne correspondent pas.');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await resetPasswordWithOtp(email, otp, password);

            if (!result) {
                toast.error('Impossible de réinitialiser le mot de passe.');
                return;
            }

            toast.success('Mot de passe mis à jour avec succès.');
            router.push('/login');
            router.refresh();
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="container flex items-center justify-center h-[calc(100vh-5rem)]">
            <div className="bg-white dark:bg-zinc-900 border-4 border-zinc-200 dark:border-zinc-700 rounded-3xl p-10 w-full max-w-md shadow-lg">
                <div className="text-center mb-8">
                    <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 font-inter">Réinitialisation</p>
                    <h2 className="text-4xl leading-tight text-zinc-950 dark:text-white">Créer un nouveau mot de passe</h2>
                    <p className="font-inter text-sm text-zinc-600 dark:text-zinc-300 mt-3">Entrez le code reçu par email et choisissez un nouveau mot de passe.</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4 font-inter">
                    <Input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="example@mail.com"
                        className="border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                    />

                    <Input
                        value={otp}
                        onChange={(event) => setOtp(event.target.value)}
                        placeholder="123456"
                        maxLength={8}
                        className="border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                    />

                    <Input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Nouveau mot de passe"
                        className="border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                    />

                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Confirmer le mot de passe"
                        className="border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400"
                    />

                    <Button type="submit" disabled={isSubmitting} className="rounded-md bg-zinc-900 dark:bg-orange-600 text-white dark:text-white py-3 uppercase tracking-[0.2em] text-xs font-semibold transition hover:bg-zinc-800 dark:hover:bg-orange-700">
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Réinitialiser'}
                    </Button>

                    <p className="text-center text-xs text-zinc-600 dark:text-zinc-400">
                        <Link href="/login" className="underline hover:text-zinc-800 dark:hover:text-zinc-200">Retour à la connexion</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
