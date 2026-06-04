"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/front/components/ui/field";
import { Separator } from "@/front/components/ui/separator";
import { Switch } from "@/front/components/ui/switch";
import { Mail } from "lucide-react";
import { useNotifPreferences } from "@/front/hooks/queries/use-notif-preferences";

export default function NotifsEmails() {
    const { prefs, updatePref, isSaving } = useNotifPreferences();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Mail className="size-5" />
                    Notifications par email
                </CardTitle>
                <CardDescription>
                    Configurez les emails que vous souhaitez recevoir.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <Field orientation="horizontal">
                        <div className="flex-1">
                            <FieldLabel>Mises à jour du produit</FieldLabel>
                            <FieldDescription>
                                Recevez des informations sur les nouvelles fonctionnalités et améliorations.
                            </FieldDescription>
                        </div>
                        <Switch
                            checked={prefs.email_product_updates}
                            disabled={isSaving}
                            onCheckedChange={(v) => updatePref("email_product_updates", v)}
                        />
                    </Field>

                    <Separator />

                    <Field orientation="horizontal">
                        <div className="flex-1">
                            <FieldLabel>Rapports hebdomadaires</FieldLabel>
                            <FieldDescription>
                                Un résumé de votre activité chaque semaine.
                            </FieldDescription>
                        </div>
                        <Switch
                            checked={prefs.email_weekly_reports}
                            disabled={isSaving}
                            onCheckedChange={(v) => updatePref("email_weekly_reports", v)}
                        />
                    </Field>

                    <Separator />

                    <Field orientation="horizontal">
                        <div className="flex-1">
                            <FieldLabel>Alertes de sécurité</FieldLabel>
                            <FieldDescription>
                                Notifications importantes concernant la sécurité de votre compte.
                            </FieldDescription>
                        </div>
                        <Switch
                            checked={prefs.email_security_alerts}
                            disabled={isSaving}
                            onCheckedChange={(v) => updatePref("email_security_alerts", v)}
                        />
                    </Field>

                    <Separator />

                    <Field orientation="horizontal">
                        <div className="flex-1">
                            <FieldLabel>Newsletter marketing</FieldLabel>
                            <FieldDescription>
                                Offres spéciales et actualités de la plateforme.
                            </FieldDescription>
                        </div>
                        <Switch
                            checked={prefs.email_marketing}
                            disabled={isSaving}
                            onCheckedChange={(v) => updatePref("email_marketing", v)}
                        />
                    </Field>
                </div>
            </CardContent>
        </Card>
    );
}
