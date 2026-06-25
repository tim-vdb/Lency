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
import { PasswordInput } from "@/front/components/ui/password-input";
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
                toast.error(error.message || 'Une erreur est survenue');
                return;
            }

            const otpResult = await sendVerificationOtp(values.email, 'email-verification');
            if (!otpResult) {
                toast.error("Compte créé mais l'email OTP n'a pas pu être envoyé.");
                return;
            }

            toast.success('Compte créé. Vérifiez votre email avec le code OTP.');
            router.push(`/verify-email?email=${encodeURIComponent(values.email)}`);
            router.refresh();
        });
    }

    return (
        <div className="flex items-center justify-center text-foreground min-h-[calc(100svh-5rem)] pt-20 pb-6 sm:pt-6 sm:pb-6">
            <div className="bg-white dark:bg-zinc-900 border-4 border-zinc-200 dark:border-zinc-700 rounded-3xl p-10 w-full max-w-md shadow-lg">

                {/* HEADER */}
                <div className="text-center mb-8">
                    <p className="text-xs uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 font-inter">
                        Inscription
                    </p>

                    <h2 className="text-4xl leading-tight text-zinc-950 dark:text-white">
                        Créer votre compte
                    </h2>

                    <p className="font-inter text-sm text-zinc-600 dark:text-zinc-300 mt-3">
                        Remplir les champs pour rejoindre Lency.
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
                                        <FormLabel className="text-zinc-700 dark:text-zinc-200">Prénom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Camille"
                                                {...field}
                                                className="rounded-md border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 px-3 py-2 focus:outline-none"
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
                                        <FormLabel className="text-zinc-700 dark:text-zinc-200">Nom</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Martin"
                                                {...field}
                                                className="rounded-md border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 px-3 py-2 focus:outline-none"
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
                                    <FormLabel className="text-zinc-700 dark:text-zinc-200">Adresse email</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="email"
                                            placeholder="example@mail.com"
                                            {...field}
                                            className="rounded-md border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 px-3 py-2 focus:outline-none"
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
                                    <FormLabel className="text-zinc-700 dark:text-zinc-200">Mot de passe</FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            placeholder="••••••••"
                                            {...field}
                                            className="rounded-md border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 px-3 py-2 focus:outline-none"
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
                                    <FormLabel className="text-zinc-700 dark:text-zinc-200">Confirmer le mot de passe</FormLabel>
                                    <FormControl>
                                        <PasswordInput
                                            placeholder="••••••••"
                                            {...field}
                                            className="rounded-md border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder:text-zinc-500 dark:placeholder:text-zinc-400 px-3 py-2 focus:outline-none"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* IMAGE UPLOAD */}
                        <div className="grid gap-2">
                            <FormLabel className="text-zinc-700 dark:text-zinc-200">Photo de profil (optionnel)</FormLabel>
                            <div className="flex items-end gap-4">
                                {imagePreview && (
                                    <div className="relative w-16 h-16 rounded-sm overflow-hidden">
                                        <Image
                                            src={imagePreview}
                                            alt="Aperçu"
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
                                        className="w-full border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white file:text-zinc-800 dark:file:text-zinc-200"
                                    />
                                    {imagePreview && (
                                        <X
                                            className="cursor-pointer text-zinc-700 dark:text-zinc-300"
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
                            className="rounded-md bg-zinc-900 dark:bg-orange-600 text-white dark:text-white py-3 uppercase tracking-[0.2em] text-xs font-semibold transition hover:bg-zinc-800 dark:hover:bg-orange-700"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                "S'inscrire"
                            )}
                        </Button>

                        <Link href="/login" className="text-sm text-zinc-600 dark:text-zinc-400 text-center underline hover:text-zinc-800 dark:hover:text-zinc-200">
                            Déjà un compte ?
                        </Link>
                    </form>
                </Form>
            </div>
        </div>
    );
}
