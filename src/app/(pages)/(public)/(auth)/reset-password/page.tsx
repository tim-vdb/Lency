'use client';

import { Suspense, FormEvent, useMemo, useState } from 'react';
import { Button } from '@/front/components/ui/button';
import { Input } from '@/front/components/ui/input';
import useEmailOtp from '@/front/hooks/use-email-otp';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

function ResetPasswordContent() {
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
            toast.error('All fields are required.');
            return;
        }

        if (password !== confirmPassword) {
            toast.error('Passwords do not match.');
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await resetPasswordWithOtp(email, otp, password);

            if (!result) {
                toast.error('Unable to reset password.');
                return;
            }

            toast.success('Password updated successfully.');
            router.push('/login');
            router.refresh();
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="container flex items-center justify-center h-[calc(100vh-5rem)]">
            <div className="bg-white border-4 rounded-3xl p-10 w-full max-w-md shadow-lg">
                <div className="text-center mb-8">
                    <p className="text-xs uppercase tracking-[0.25em] dark:text-black font-inter">Reset password</p>
                    <h2 className="text-4xl leading-tight dark:text-black">Create a new password</h2>
                    <p className="font-inter text-sm dark:text-black mt-3">Enter the OTP you received and choose a new password.</p>
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

                    <Input
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="New password"
                    />

                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="Confirm password"
                    />

                    <Button type="submit" disabled={isSubmitting} className="rounded-md text-white py-3 uppercase tracking-[0.2em] text-xs font-semibold transition">
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Reset password'}
                    </Button>

                    <p className="text-center text-xs text-neutral-500">
                        <Link href="/login" className="underline">Back to login</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    );
}
