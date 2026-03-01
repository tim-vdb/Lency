"use client"

import { Button } from "@/front/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/front/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/front/components/ui/tabs";
import { cn } from "@/front/lib/utils";
import { FolderOpen, Users, Briefcase, UserPlus, Rocket, FileText } from "lucide-react";

const marketplaceData = [
    {
        category: "Nos projets",
        value: "projects",
        icon: FolderOpen,
        items: [
            {
                title: "Rejoindre un projet",
                description: "Découvrez les projets audio & visuel en cours qui recrutent activement des talents comme le vôtre.",
                icon: Briefcase,
                buttons: [
                    { label: "Découvrir les projets", variant: "default" as const },
                    { label: "Déposer ma candidature", variant: "outline" as const }
                ]
            },
            {
                title: "Lancer votre projet",
                description: "Créez votre projet audio/visuel, définissez vos besoins et recrutez votre équipe au sein de la communauté.",
                icon: Rocket,
                buttons: [
                    { label: "Créer un projet", variant: "default" as const },
                    { label: "Voir les exemples", variant: "outline" as const }
                ]
            }
        ]
    },
    {
        category: "Nos membres",
        value: "members",
        icon: Users,
        items: [
            {
                title: "Recruter des talents",
                description: "Trouvez rapidement les profils spécialisés dont vous avez besoin : monteur, sound designer, comédien, etc.",
                icon: UserPlus,
                buttons: [
                    { label: "Parcourir les membres", variant: "default" as const },
                    { label: "Publier une offre", variant: "outline" as const }
                ]
            },
            {
                title: "Valoriser mon profil",
                description: "Valorisez vos compétences, mettez en avant vos réalisations et soyez contacté(e) pour des collaborations.",
                icon: FileText,
                buttons: [
                    { label: "Compléter mon profil", variant: "default" as const },
                    { label: "Aperçu des opportunités", variant: "outline" as const }
                ]
                // TODO: Au début "Compléter" puis "Optimiser" une fois que le profil est complété
            }
        ]
    }
];

export default function MarketplaceBlock({ className }: { className?: string }) {
    return (
        <Card className={cn("flex flex-col overflow-hidden shadow-xl-inset", className)}>
            <CardHeader className="px-6">
                <CardTitle className="text-lg">Nos Marketplaces</CardTitle>
                <CardDescription className="text-sm">Connectez-vous aux projets et aux créateurs</CardDescription>
            </CardHeader>

            <Tabs defaultValue="projects" className="flex-1 flex flex-col px-6">
                <TabsList className="grid w-full grid-cols-2 gap-4 mb-4">
                    {marketplaceData.map((section) => {
                        const Icon = section.icon;
                        return (
                            <TabsTrigger
                                key={section.value}
                                value={section.value}
                                className="gap-2"
                            >
                                <Icon className="w-4 h-4" />
                                {section.category}
                            </TabsTrigger>
                        );
                    })}
                </TabsList>

                {marketplaceData.map((section) => (
                    <TabsContent
                        key={section.value}
                        value={section.value}
                        className="grid grid-cols-2 gap-4 mt-0"
                    >
                        {section.items.map((item, itemIndex) => {
                            const ItemIcon = item.icon;
                            return (
                                <Card
                                    key={itemIndex}
                                    className="group hover:shadow-lg transition-all duration-300 border border-neutral-300 hover:border-neutral-400 justify-between"
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                                <ItemIcon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-base mb-1">{item.title}</CardTitle>
                                                <CardDescription className="text-sm leading-relaxed">
                                                    {item.description}
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardFooter className="gap-2 pt-0">
                                        {item.buttons.map((button, buttonIndex) => (
                                            <Button
                                                key={buttonIndex}
                                                variant={button.variant}
                                                size="sm"
                                                className="flex-1 transition-all"
                                            >
                                                {button.label}
                                            </Button>
                                        ))}
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </TabsContent>
                ))}
            </Tabs>
        </Card>
    );
}