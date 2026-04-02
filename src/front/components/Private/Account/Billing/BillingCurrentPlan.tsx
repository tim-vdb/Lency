import { Badge } from "@/front/components/ui/badge";
import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";

export default function BillingCurrentPlan() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Abonnement actuel</CardTitle>
                <CardDescription>
                    Gérez votre abonnement et consultez les détails de votre forfait.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-semibold">Plan Gratuit</h3>
                                <Badge variant="secondary">Actif</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                                Accès aux fonctionnalités de base
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold">0€</p>
                            <p className="text-sm text-muted-foreground">/mois</p>
                        </div>
                    </div>

                    <Button className="w-full sm:w-auto">Passer à Pro</Button>
                </div>
            </CardContent>
        </Card>
    );
}