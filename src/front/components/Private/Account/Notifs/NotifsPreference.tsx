"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/front/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/front/components/ui/select";
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

                    <Separator />

                    <Field>
                        <FieldLabel>Fréquence des résumés</FieldLabel>
                        <Select
                            value={prefs.digest_frequency}
                            disabled={isSaving}
                            onValueChange={(v) => updatePref("digest_frequency", v as typeof prefs.digest_frequency)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner une fréquence" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="realtime">Temps réel</SelectItem>
                                <SelectItem value="daily">Quotidien</SelectItem>
                                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                                <SelectItem value="monthly">Mensuel</SelectItem>
                                <SelectItem value="never">Jamais</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>

                    <Field>
                        <FieldLabel>Langue des notifications</FieldLabel>
                        <Select
                            value={prefs.language}
                            disabled={isSaving}
                            onValueChange={(v) => updatePref("language", v as typeof prefs.language)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Sélectionner une langue" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="fr">Français</SelectItem>
                                <SelectItem value="en">English</SelectItem>
                                <SelectItem value="es">Español</SelectItem>
                                <SelectItem value="de">Deutsch</SelectItem>
                            </SelectContent>
                        </Select>
                    </Field>
                </div>
            </CardContent>
        </Card>
    );
}
