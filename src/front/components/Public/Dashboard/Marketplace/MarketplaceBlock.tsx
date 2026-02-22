import { Button } from "@/front/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/front/components/ui/card";

const marketplaceData = [
    {
        category: "Nos projets",
        items: [
            {
                title: "Rejoindre un projet",
                description: "Découvrez les projets audio & visuel en cours qui recrutent activement des talents comme le vôtre.",
                buttons: [
                    { label: "Découvrir les projets" },
                    { label: "Déposer ma candidature" }
                ]
            },
            {
                title: "Lancer votre projet",
                description: "Créez votre projet audio/visuel, définissez vos besoins et recrutez votre équipe au sein de la communauté.",
                buttons: [
                    { label: "Créer un projet" },
                    { label: "Voir les exemples" }
                ]
            }
        ]
    },
    {
        category: "Nos membres",
        items: [
            {
                title: "Recruter des talents",
                description: "Trouvez rapidement les profils spécialisés dont vous avez besoin : monteur, sound designer, comédien, etc.",
                buttons: [
                    { label: "Parcourir les membres" },
                    { label: "Publier une offre" }
                ]
            },
            {
                title: "Valoriser mon profil",
                description: "Valorisez vos compétences, mettez en avant vos réalisations et soyez contacté(e) pour des collaborations.",
                buttons: [
                    { label: "Compléter mon profil" },
                    { label: "Aperçu des opportunités" }
                ]
                // TODO: Au début "Compléter" puis "Optimiser" une fois que le profil est complété
            }
        ]
    }
];

export default function MarketplaceBlock() {
    return (
        <Card className="col-[1/5] row-[5/9] justify-between border border-neutral-400">
            <CardHeader className="px-4">
                <CardTitle>Nos marketplaces</CardTitle>
                <CardDescription>Connectez-vous aux projets et aux créateurs</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-5 px-4 h-full">
                {marketplaceData.map((section, sectionIndex) => (
                    <Card key={sectionIndex} className="border-none shadow-none gap-1 text-neutral-400 py-0">
                        <CardHeader className="px-0">
                            <CardTitle className="text-xs">{section.category}</CardTitle>
                        </CardHeader>
                        <CardContent className="grid grid-rows-2 h-full gap-4 px-0">
                            {section.items.map((item, itemIndex) => (
                                <Card key={itemIndex} className="flex justify-between py-3 px-4 gap-2 border border-neutral-400 shadow-lg-base">
                                    <CardHeader className="px-0">
                                        <CardTitle className="text-sm">{item.title}</CardTitle>
                                        <CardDescription className="line-clamp-2 text-xs px-0" >{item.description}</CardDescription>
                                    </CardHeader>

                                    <CardFooter className="grid grid-cols-2 gap-2 px-0">
                                        {item.buttons.map((button, buttonIndex) => (
                                            <Button
                                                key={buttonIndex}
                                                variant="outline"
                                                size="sm"
                                                className="border p-1 bg-neutral-200 cursor-pointer text-xs"
                                            >
                                                {button.label}
                                            </Button>
                                        ))}
                                    </CardFooter>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
}