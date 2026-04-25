"use client";

import { useUser } from "@/front/context/UserContext";
import { useModalStore } from "@/front/stores/use-modal.store";

export function useRequireAuth() {
    const user = useUser();
    const openModal = useModalStore((state) => state.openModal);

    return (callback: () => void): boolean => {
        if (!user) {
            openModal("authPrompt");
            return false;
        }
        callback();
        return true;
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
