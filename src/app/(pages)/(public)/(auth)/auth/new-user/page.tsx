"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import useSendEmail from "@/front/hooks/use-send-email";

function OAuthNewUserContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/";
    const { sendEmail } = useSendEmail();
    const hasSentRef = useRef(false);

    useEffect(() => {
        if (hasSentRef.current) {
            return;
        }

        hasSentRef.current = true;

        async () => {
            const result = await sendEmail();

            if (result) {
                toast.success("Email de bienvenue envoye.");
            } else {
                toast.error("Erreur lors de l'envoi de l'email de bienvenue.");
            }

            router.replace(callbackUrl);
        };

    }, [callbackUrl, router, sendEmail]);

    return null;
}

export default function OAuthNewUserPage() {
    return (
        <Suspense fallback={null}>
            <OAuthNewUserContent />
        </Suspense>
    );
}