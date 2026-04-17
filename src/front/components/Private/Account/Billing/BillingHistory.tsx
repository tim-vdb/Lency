import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Separator } from "@/front/components/ui/separator";

export default function BillingHistory() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Historique de facturation</CardTitle>
                <CardDescription>
                    Consultez et téléchargez vos factures précédentes.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                        Aucune facture disponible pour le moment.
                    </p>

                    <Separator />

                    <div className="text-sm text-muted-foreground">
                        <p>
                            Les factures apparaîtront ici une fois que vous aurez souscrit à un abonnement payant.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}