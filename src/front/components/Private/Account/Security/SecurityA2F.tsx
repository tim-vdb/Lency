import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/front/components/ui/field";
import { Separator } from "@/front/components/ui/separator";
import { Switch } from "@/front/components/ui/switch";
import { Shield } from "lucide-react";

export default function SecurityA2F() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Shield className="size-5" />
                    Authentification à deux facteurs
                </CardTitle>
                <CardDescription>
                    Ajoutez une couche de sécurité supplémentaire à votre compte.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <Field orientation="horizontal">
                        <div className="flex-1">
                            <FieldLabel>Activer la 2FA</FieldLabel>
                            <FieldDescription>
                                Utilisez une application d&apos;authentification pour générer des codes de vérification.
                            </FieldDescription>
                        </div>
                        <Switch />
                    </Field>

                    <Separator />
                </div>
            </CardContent>
        </Card>
    );
}