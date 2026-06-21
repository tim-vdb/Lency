"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/front/components/ui/field";
import { Switch } from "@/front/components/ui/switch";
import { Separator } from "@/front/components/ui/separator";
import { MessageSquare } from "lucide-react";
import { useNotifPreferences } from "@/front/queries/notif-preferences";

export default function NotifsPreference() {
    const { prefs, updatePref, isSaving } = useNotifPreferences();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="size-5" />
                    Préférences de communication
                </CardTitle>
                <CardDescription>
                    Personnalisez comment et quand vous recevez des notifications.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <Field orientation="horizontal">
                        <div className="flex-1">
                            <FieldLabel>Notifications Projets</FieldLabel>
                            <FieldDescription>
                                Afficher les notifications liées aux projets dans la sidebar.
                            </FieldDescription>
                        </div>
                        <Switch
                            checked={prefs.show_projects}
                            disabled={isSaving}
                            onCheckedChange={(v) => updatePref("show_projects", v)}
                        />
                    </Field>

                    <Separator />

                    <Field orientation="horizontal">
                        <div className="flex-1">
                            <FieldLabel>Notifications Messages</FieldLabel>
                            <FieldDescription>
                                Afficher les conversations dans la sidebar de notifications.
                            </FieldDescription>
                        </div>
                        <Switch
                            checked={prefs.show_messages}
                            disabled={isSaving}
                            onCheckedChange={(v) => updatePref("show_messages", v)}
                        />
                    </Field>

                    <Separator />

                    <Field orientation="horizontal">
                        <div className="flex-1">
                            <FieldLabel>Notifications Communauté</FieldLabel>
                            <FieldDescription>
                                Afficher les activités communautaires (posts, follows, etc.).
                            </FieldDescription>
                        </div>
                        <Switch
                            checked={prefs.show_community}
                            disabled={isSaving}
                            onCheckedChange={(v) => updatePref("show_community", v)}
                        />
                    </Field>


                </div>
            </CardContent>
        </Card>
    );
}
