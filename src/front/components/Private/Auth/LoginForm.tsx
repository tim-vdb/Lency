"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useTransition } from "react";
import { LoginFormSchema, type LoginFormValues } from "@/front/schemas/zod/auth/login.zod";
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
import { Loader2 } from "lucide-react";
import { signIn } from "@/back/lib/auth-client";
import { CardFooter } from "@/front/components/ui/card";
import Link from "next/link";
import { cn } from "@/front/lib/utils";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    startTransition(async () => {
      const { error } = await signIn.email({
        email: values.email,
        password: values.password,
      });
      if (error) {
        toast.error(error.message || 'Une erreur est survenue');
        return;
      }
      toast.success('Utilisateur connecté');
      router.push(callbackUrl ?? '/account');
      router.refresh();
    });
  }

  return (
    <>
      <div className="flex items-center justify-center text-foreground h-[calc(100svh-5rem)]">
        <div className="bg-white dark:bg-white border-4 border-zinc-200 dark:border-zinc-300 rounded-3xl p-10 w-full max-w-md shadow-lg">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-700 dark:text-zinc-700 font-inter">
              Login
            </p>
            <h2 className="text-4xl leading-tight text-zinc-950 dark:text-zinc-900">
              Welcome back to Lency
            </h2>
            <p className="font-inter text-sm text-zinc-600 dark:text-zinc-600 mt-3">
              Log in to access your account.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6 font-inter"
            >
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-zinc-800 dark:text-zinc-900">Password</FormLabel>
                    <FormControl>
                      <PasswordInput
                        placeholder="••••••••"
                        {...field}
                        className="rounded-md border-zinc-300 dark:border-zinc-300 bg-white dark:bg-zinc-50 text-zinc-900 dark:text-zinc-900 placeholder:text-zinc-500 dark:placeholder:text-zinc-500 px-3 py-2 focus:outline-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Link href="/forgot-password" className="text-xs text-zinc-600 dark:text-zinc-700 underline">
                  Forgot your password?
                </Link>
              </div>

              <Button
                type="submit"
                className="rounded-md dark:bg-background text-white py-3 uppercase tracking-[0.2em] text-xs font-semibold transition"
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "log in"
                )}
              </Button>

              <Button
                variant="outline"
                className={cn("w-full gap-2 border-zinc-300 dark:border-zinc-300 text-zinc-800 dark:text-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-100")}
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    await signIn.social({
                      provider: "google",
                      callbackURL: callbackUrl ?? "/account",
                      newUserCallbackURL: `/account`,
                    });
                  });
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="0.98em"
                  height="1em"
                  viewBox="0 0 256 262"
                >
                  <path
                    fill="#4285F4"
                    d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                  ></path>
                  <path
                    fill="#34A853"
                    d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                  ></path>
                  <path
                    fill="#FBBC05"
                    d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                  ></path>
                  <path
                    fill="#EB4335"
                    d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                  ></path>
                </svg>
                Sign in with Google
              </Button>
              <CardFooter>
                <div className="flex justify-center w-full py-4">
                  <p className="text-center text-xs text-zinc-500 dark:text-zinc-600">
                    <Link href="/sign-up" className="underline">
                      <span>
                        Need an account?
                      </span>
                    </Link>
                  </p>
                </div>
              </CardFooter>

            </form>
          </Form>
        </div>
      </div>

    </>
  );
}
