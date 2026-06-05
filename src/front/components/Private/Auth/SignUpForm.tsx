"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { SignUpFormSchema, type SignUpFormValues } from "@/front/schemas/zod/auth/signup.zod";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/front/components/ui/form";
import { Input } from "@/front/components/ui/input";
import { Button } from "@/front/components/ui/button";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import useEmailOtp from "@/front/hooks/use-email-otp";
import { signUp } from "@/back/lib/auth-client";

export default function SignUpForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const { sendVerificationOtp } = useEmailOtp();

    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(SignUpFormSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            passwordConfirmation: "",
        },
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    async function convertImageToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function onSubmit(values: SignUpFormValues) {
        startTransition(async () => {
            const { error } = await signUp.email({
                name: `${values.firstName} ${values.lastName}`,
                email: values.email,
                password: values.password,
                image: image ? await convertImageToBase64(image) : "",
                callbackURL: "/account",
                firstname: values.firstName,
                lastname: values.lastName,
            });
            if (error) {
                toast.error(error.message || 'An error occurred');
                return;
            }

            const otpResult = await sendVerificationOtp(values.email, 'email-verification');
            if (!otpResult) {
                toast.error("Account created but OTP email was not sent.");
                return;
            }

            toast.success('Account created. Verify your email with the OTP code.');
            router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
            router.refresh();
        });
    }

    return (
        <div className="flex items-center justify-center text-foreground h-[calc(100svh-5rem)]">
            <div className="bg-white dark:bg-white border-4 border-zinc-200 dark:border-zinc-300 rounded-3xl p-10 w-full max-w-md shadow-lg">

                {/* HEADER */}
                <div className="text-center mb-8">
                    <p className="text-xs uppercase tracking-[0.25em] text-zinc-700 dark:text-zinc-700 font-inter">
                        Sign up
                    </p>

                    <h2 className="text-4xl leading-tight text-zinc-950 dark:text-zinc-900">
                        Create your player account
                    </h2>

                    <p className="font-inter text-sm text-zinc-600 dark:text-zinc-600 mt-3">
                        Fill in the fields to join Chef’s Blueprint.
                    </p>
                </div>

                {/* FORM */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col gap-6 font-inter"
                    >
                        {/* NAME FIELDS */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="firstName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-800 dark:text-zinc-900">First name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Camille"
                                                {...field}
                                                className="rounded-md border-zinc-300 dark:border-zinc-300 bg-white dark:bg-zinc-50 text-zinc-900 dark:text-zinc-900 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 px-3 py-2 focus:outline-none"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="lastName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-zinc-800 dark:text-zinc-900">Last name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Martin"
                                                {...field}
                                                className="rounded-md border-zinc-300 dark:border-zinc-300 bg-white dark:bg-zinc-50 text-zinc-900 dark:text-zinc-900 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 px-3 py-2 focus:outline-none"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* EMAIL */}
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-800 dark:text-zinc-900">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="example@mail.com"
                                            {...field}
                                            className="rounded-md border-zinc-300 dark:border-zinc-300 bg-white dark:bg-zinc-50 text-zinc-900 dark:text-zinc-900 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 px-3 py-2 focus:outline-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* PASSWORD */}
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-800 dark:text-zinc-900">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            {...field}
                                            className="rounded-md border-zinc-300 dark:border-zinc-300 bg-white dark:bg-zinc-50 text-zinc-900 dark:text-zinc-900 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 px-3 py-2 focus:outline-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* CONFIRM PASSWORD */}
                        <FormField
                            control={form.control}
                            name="passwordConfirmation"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-zinc-800 dark:text-zinc-900">Confirm password</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="••••••••"
                                            {...field}
                                            className="rounded-md border-zinc-300 dark:border-zinc-300 bg-white dark:bg-zinc-50 text-zinc-900 dark:text-zinc-900 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 px-3 py-2 focus:outline-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* IMAGE UPLOAD */}
                        <div className="grid gap-2">
                            <FormLabel className="text-zinc-800 dark:text-zinc-900">Profile picture (optional)</FormLabel>
                            <div className="flex items-end gap-4">
                                {imagePreview && (
                                    <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            width={64}
                                            height={64}
                                            className="object-cover"
                                        />
                                    </div>
                                )}

                                <div className="flex items-center gap-2 w-full">
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full border-zinc-300 dark:border-zinc-300 bg-white dark:bg-zinc-50 text-zinc-900 dark:text-zinc-900 file:text-zinc-800 dark:file:text-zinc-800"
                                    />
                                    {imagePreview && (
                                        <X
                                            className="cursor-pointer text-zinc-700 dark:text-zinc-700"
                                            onClick={() => {
                                                setImage(null);
                                                setImagePreview(null);
                                            }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* SUBMIT */}
                        <Button
                            type="submit"
                            className="rounded-md dark:bg-background text-white py-3 uppercase tracking-[0.2em] text-xs font-semibold  transition"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                "Sign up"
                            )}
                        </Button>

                        <Link href="/login" className="text-sm text-zinc-600 dark:text-zinc-700 text-center underline">
                            Already have an account?
                        </Link>
                    </form>
                </Form>
            </div>
        </div>
    );
}
