import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/front/components/ui/field";
import { Separator } from "@/front/components/ui/separator";
import { Switch } from "@/front/components/ui/switch";
import { Mail } from "lucide-react";

export default function NotifsEmails() {
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
                        <Switch defaultChecked />
                    </Field>

                    <Separator />

                    <Field orientation="horizontal">
                        <div className="flex-1">
                            <FieldLabel>Rapports hebdomadaires</FieldLabel>
                            <FieldDescription>
                                Un résumé de votre activité chaque semaine.
                            </FieldDescription>
                        </div>
                        <Switch defaultChecked />
                    </Field>

                    <Separator />

                    <Field orientation="horizontal">
                        <div className="flex-1">
                            <FieldLabel>Alertes de sécurité</FieldLabel>
                            <FieldDescription>
                                Notifications importantes concernant la sécurité de votre compte.
                            </FieldDescription>
                        </div>
                        <Switch defaultChecked />
                    </Field>

                    <Separator />

                    <Field orientation="horizontal">
                        <div className="flex-1">
                            <FieldLabel>Newsletter marketing</FieldLabel>
                            <FieldDescription>
                                Offres spéciales et actualités de la plateforme.
                            </FieldDescription>
                        </div>
                        <Switch />
                    </Field>
                </div>
            </CardContent>
        </Card>
    );
}