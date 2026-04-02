import { Badge } from "@/front/components/ui/badge";
import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Check } from "lucide-react";

export default function BillingPlans() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Forfaits disponibles</CardTitle>
                <CardDescription>
                    Comparez les forfaits et choisissez celui qui vous convient.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                    {/* Free Plan */}
                    <div className="rounded-lg border p-4">
                        <h4 className="font-semibold">Gratuit</h4>
                        <p className="text-2xl font-bold mt-2">0€<span className="text-sm font-normal text-muted-foreground">/mois</span></p>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <Check className="size-4 text-primary" />
                                5 projets
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="size-4 text-primary" />
                                1 Go de stockage
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="size-4 text-primary" />
                                Support communautaire
                            </li>
                        </ul>
                        <Button variant="outline" className="w-full mt-4" disabled>
                            Plan actuel
                        </Button>
                    </div>

                    {/* Pro Plan */}
                    <div className="rounded-lg border-2 border-primary p-4 relative">
                        <Badge className="absolute -top-2.5 left-4">Populaire</Badge>
                        <h4 className="font-semibold">Pro</h4>
                        <p className="text-2xl font-bold mt-2">19€<span className="text-sm font-normal text-muted-foreground">/mois</span></p>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <Check className="size-4 text-primary" />
                                Projets illimités
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="size-4 text-primary" />
                                50 Go de stockage
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="size-4 text-primary" />
                                Support prioritaire
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="size-4 text-primary" />
                                Fonctionnalités avancées
                            </li>
                        </ul>
                        <Button className="w-full mt-4">Choisir Pro</Button>
                    </div>

                    {/* Enterprise Plan */}
                    <div className="rounded-lg border p-4">
                        <h4 className="font-semibold">Entreprise</h4>
                        <p className="text-2xl font-bold mt-2">Sur mesure</p>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                                <Check className="size-4 text-primary" />
                                Tout de Pro
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="size-4 text-primary" />
                                Stockage illimité
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="size-4 text-primary" />
                                Support dédié
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="size-4 text-primary" />
                                SLA personnalisé
                            </li>
                        </ul>
                        <Button variant="outline" className="w-full mt-4">Contacter</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}