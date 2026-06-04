"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/front/components/ui/field";
import { Separator } from "@/front/components/ui/separator";
import { Switch } from "@/front/components/ui/switch";
import { Bell } from "lucide-react";
import { useNotifPreferences } from "@/front/queries/notif-preferences";

export default function NotifsPush() {
    const { prefs, updatePref, isSaving } = useNotifPreferences();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Bell className="size-5" />
                    Notifications push
                </CardTitle>
                <CardDescription>
                    Gérez les notifications sur votre navigateur ou appareil mobile.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <Field orientation="horizontal">
                        <div className="flex-1">
                            <FieldLabel>Activer les notifications push</FieldLabel>
                            <FieldDescription>
                                Recevez des alertes en temps réel sur votre appareil.
                            </FieldDescription>
                        </div>
                        <Switch
                            checked={prefs.push_enabled}
                            disabled={isSaving}
                            onCheckedChange={(v) => updatePref("push_enabled", v)}
                        />
                    </Field>

                    <Separator />

                    <Field orientation="horizontal">
                        <div className="flex-1">
                            <FieldLabel>Mentions et commentaires</FieldLabel>
                            <FieldDescription>
                                Quand quelqu&apos;un vous mentionne ou commente vos projets.
                            </FieldDescription>
                        </div>
                        <Switch
                            checked={prefs.push_mentions}
                            disabled={isSaving || !prefs.push_enabled}
                            onCheckedChange={(v) => updatePref("push_mentions", v)}
                        />
                    </Field>

                    <Separator />

                    <Field orientation="horizontal">
                        <div className="flex-1">
                            <FieldLabel>Mises à jour des projets</FieldLabel>
                            <FieldDescription>
                                Changements sur les projets que vous suivez.
                            </FieldDescription>
                        </div>
                        <Switch
                            checked={prefs.push_project_updates}
                            disabled={isSaving || !prefs.push_enabled}
                            onCheckedChange={(v) => updatePref("push_project_updates", v)}
                        />
                    </Field>
                </div>
            </CardContent>
        </Card>
    );
}
