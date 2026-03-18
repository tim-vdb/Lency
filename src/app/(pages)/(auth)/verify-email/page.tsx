'use client';

import { Button } from '@/front/components/ui/button';
import { Input } from '@/front/components/ui/input';
import useEmailOtp from '@/front/hooks/use-email-otp';
import useSendEmail from '@/front/hooks/use-send-email';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useMemo, useState } from 'react';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
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
            toast.error('Email is required.');
            return;
        }

        setIsSending(true);
        try {
            const result = await sendVerificationOtp(email, 'email-verification');

            if (!result) {
                toast.error('Unable to send verification OTP.');
                return;
            }

            toast.success('Verification OTP sent.');
        } finally {
            setIsSending(false);
        }
    }

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!email || !otp) {
            toast.error('Email and OTP are required.');
            return;
        }

        setIsVerifying(true);
        try {
            const result = await verifyEmailOtp(email, otp);

            if (!result) {
                toast.error('Invalid OTP or expired code.');
                return;
            }

            toast.success('Email verified successfully.');

            const welcomeResult = await sendEmail({
                email: email,
            });

            if (!welcomeResult) {
                toast.error("Account created but welcome email was not sent.");
            }
            router.push('/');
            router.refresh();
        } finally {
            setIsVerifying(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12">
            <div className="bg-white border-4 rounded-3xl p-10 w-full max-w-md shadow-lg mb-24">
                <div className="text-center mb-8">
                    <p className="text-xs uppercase tracking-[0.25em] dark:text-black font-inter">Verify email</p>
                    <h2 className="text-4xl leading-tight dark:text-black">Confirm your email address</h2>
                    <p className="font-inter text-sm dark:text-black mt-3">Enter the OTP code sent to your inbox.</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4 font-inter">
                    <Input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="example@mail.com"
                    />

                    <Input
                        value={otp}
                        onChange={(event) => setOtp(event.target.value)}
                        placeholder="123456"
                        maxLength={8}
                    />

                    <Button type="submit" disabled={isVerifying} className="rounded-md text-white py-3 uppercase tracking-[0.2em] text-xs font-semibold transition">
                        {isVerifying ? <Loader2 size={16} className="animate-spin" /> : 'Verify email'}
                    </Button>

                    <Button type="button" variant="outline" onClick={resendOtp} disabled={isSending || !email}>
                        {isSending ? <Loader2 size={16} className="animate-spin" /> : 'Resend OTP'}
                    </Button>

                    <p className="text-center text-xs text-neutral-500">
                        <Link href="/login" className="underline">Back to login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
