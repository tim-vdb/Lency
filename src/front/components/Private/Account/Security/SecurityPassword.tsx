import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/front/components/ui/field";
import { Input } from "@/front/components/ui/input";

export default function SecurityPassword() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Mot de passe</CardTitle>
                <CardDescription>
                    Modifiez votre mot de passe pour sécuriser votre compte.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="currentPassword">Mot de passe actuel</FieldLabel>
                        <Input id="currentPassword" type="password" placeholder="••••••••" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="newPassword">Nouveau mot de passe</FieldLabel>
                        <Input id="newPassword" type="password" placeholder="••••••••" />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="confirmPassword">Confirmer le mot de passe</FieldLabel>
                        <Input id="confirmPassword" type="password" placeholder="••••••••" />
                    </Field>
                    <div className="flex justify-end">
                        <Button>Mettre à jour le mot de passe</Button>
                    </div>
                </FieldGroup>
            </CardContent>
        </Card>
    );
}