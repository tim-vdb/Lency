import { AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";

export default function ProfileDelete() {
    return (
        <Card className="border-destructive/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="size-5" />
                    Zone de danger
                </CardTitle>
                <CardDescription>
                    Actions irréversibles concernant votre compte.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div>
                        <h4 className="font-medium">Supprimer votre compte</h4>
                        <p className="text-sm text-muted-foreground">
                            Cette action est permanente et irréversible. Toutes vos données seront supprimées de la plateforme.
                        </p>
                    </div>
                    <Button variant="destructive" className="w-full sm:w-auto">
                        Supprimer mon compte
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}