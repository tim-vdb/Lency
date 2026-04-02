import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Separator } from "@/front/components/ui/separator";
import { Badge, LogOut, Monitor, Smartphone } from "lucide-react";

export default function SecuritySession() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sessions actives</CardTitle>
                <CardDescription>
                    Gérez vos appareils connectés et déconnectez les sessions suspectes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    {/* Current Session */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <Monitor className="size-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Chrome sur Windows</p>
                                <p className="text-sm text-muted-foreground">Paris, France · Actif maintenant</p>
                            </div>
                        </div>
                        <Badge>Actuelle</Badge>
                    </div>

                    {/* Other Session */}
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-3">
                            <Smartphone className="size-5 text-muted-foreground" />
                            <div>
                                <p className="font-medium">Safari sur iPhone</p>
                                <p className="text-sm text-muted-foreground">Lyon, France · Il y a 2 jours</p>
                            </div>
                        </div>
                        <Button variant="ghost" size="sm">
                            <LogOut className="size-4" />
                            Déconnecter
                        </Button>
                    </div>

                    <Separator />

                    <Button variant="outline" className="w-full">
                        Déconnecter toutes les autres sessions
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}