import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import { CreditCard, Plus } from "lucide-react";

export default function BillingPaymentMethods() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CreditCard className="size-5" />
                    Moyens de paiement
                </CardTitle>
                <CardDescription>
                    Gérez vos cartes et méthodes de paiement.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground">
                        Aucun moyen de paiement enregistré.
                    </p>
                    <Button variant="outline" className="w-full sm:w-auto">
                        <Plus className="size-4" />
                        Ajouter une carte
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}