"use client";

import { useUser } from "@/front/states/contexts/user.context";
import { useModalStore } from "@/front/states/stores/modal.store";

export function useRequireAuth() {
    const user = useUser();
    const openModal = useModalStore((state) => state.openModal);

    return (callback: () => void) => {
        if (!user) {
            openModal("authPrompt");
            return;
        }
        callback();
    };
}
interface UseConfirmOptions {
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
}

export function useConfirm(options: UseConfirmOptions = {}) {
    const openModal = useModalStore((state) => state.openModal);

    return (callback: () => void) => {
        openModal("confirm", {
            title: options.title,
            description: options.description,
            confirmText: options.confirmText,
            cancelText: options.cancelText,
            onConfirm: callback,
        });
    };
}

interface UseAlertOptions {
    title?: string;
    description?: string;
    buttonText?: string;
}

export function useAlert(options: UseAlertOptions = {}) {
    const openModal = useModalStore((state) => state.openModal);

    return () => {
        openModal("alert", {
            title: options.title,
            description: options.description,
            buttonText: options.buttonText,
        });
    };
}
