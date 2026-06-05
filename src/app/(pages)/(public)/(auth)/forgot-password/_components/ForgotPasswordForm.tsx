'use client';

import { Button } from '@/front/components/ui/button';
import { Input } from '@/front/components/ui/input';
import useEmailOtp from '@/front/hooks/use-email-otp';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

export default function ForgotPasswordForm() {
    const router = useRouter();
    const { sendVerificationOtp } = useEmailOtp();
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function onSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!email) {
            toast.error('Email is required.');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await sendVerificationOtp(email, 'forget-password');

            if (!result) {
                toast.error('Unable to send reset OTP.');
                return;
            }

            toast.success('Reset OTP sent.');
            router.push(`/reset-password?email=${encodeURIComponent(email)}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="container flex items-center justify-center h-[calc(100vh-5rem)]">
            <div className="bg-white border-4 rounded-3xl p-10 w-full max-w-md shadow-lg">
                <div className="text-center mb-8">
                    <p className="text-xs uppercase tracking-[0.25em] dark:text-black font-inter">Password reset</p>
                    <h2 className="text-4xl leading-tight dark:text-black">Forgot your password?</h2>
                    <p className="font-inter text-sm dark:text-black mt-3">We will send you an OTP code by email.</p>
                </div>

                <form onSubmit={onSubmit} className="flex flex-col gap-4 font-inter">
                    <Input
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="example@mail.com"
                    />

                    <Button type="submit" disabled={isSubmitting} className="rounded-md text-white py-3 uppercase tracking-[0.2em] text-xs font-semibold transition">
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Send OTP'}
                    </Button>

                    <p className="text-center text-xs text-neutral-500">
                        <Link href="/login" className="underline">Back to login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
