import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Field, FieldLabel } from "@/front/components/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/front/components/ui/select";
import { MessageSquare } from "lucide-react";


export default function NotifsPreference() {
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
                    <Field>
                        <FieldLabel>Fréquence des résumés</FieldLabel>
                        <Select defaultValue="weekly">
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
                        <Select defaultValue="fr">
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