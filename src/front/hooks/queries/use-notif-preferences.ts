"use client";

import { useMemo } from "react";
import { useMyConfigs, useCreateUserConfig, useUpdateUserConfig } from "./use-userConfigs";

const CONFIG_TITLE = "notif_preferences";

export interface NotifPreferences {
    show_projects: boolean;
    show_community: boolean;
    show_messages: boolean;
    push_enabled: boolean;
    push_mentions: boolean;
    push_project_updates: boolean;
    email_product_updates: boolean;
    email_weekly_reports: boolean;
    email_security_alerts: boolean;
    email_marketing: boolean;
    digest_frequency: "realtime" | "daily" | "weekly" | "monthly" | "never";
    language: "fr" | "en" | "es" | "de";
}

const DEFAULTS: NotifPreferences = {
    show_projects: true,
    show_community: true,
    show_messages: true,
    push_enabled: true,
    push_mentions: true,
    push_project_updates: false,
    email_product_updates: true,
    email_weekly_reports: true,
    email_security_alerts: true,
    email_marketing: false,
    digest_frequency: "weekly",
    language: "fr",
};

export function useNotifPreferences() {
    const { data: configs = [], isLoading } = useMyConfigs();
    const { mutate: create, isPending: isCreating } = useCreateUserConfig();
    const { mutate: update, isPending: isUpdating } = useUpdateUserConfig();

    const config = useMemo(() => configs.find(c => c.title === CONFIG_TITLE), [configs]);

    const prefs: NotifPreferences = useMemo(() => ({
        ...DEFAULTS,
        ...(config?.content as Partial<NotifPreferences> ?? {}),
    }), [config]);

    const updatePref = <K extends keyof NotifPreferences>(key: K, value: NotifPreferences[K]) => {
        const newContent = { ...prefs, [key]: value };
        if (config) {
            update({ id: config.id, data: { content: newContent } });
        } else {
            create({ title: CONFIG_TITLE, content: newContent });
        }
    };

    return {
        prefs,
        updatePref,
        isLoading,
        isSaving: isCreating || isUpdating,
    };
}
