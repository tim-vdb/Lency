"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import useSendEmail from "@/front/hooks/sendEmails";

export default function OAuthNewUserPage() {
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