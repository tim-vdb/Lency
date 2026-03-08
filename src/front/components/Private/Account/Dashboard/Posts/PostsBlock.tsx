'use client';

import { Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "../../../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../ui/card";

import { cn } from "@/front/lib/utils";
import 'swiper/css';

// Données mockées pour les posts de communautés
const communityPosts = [
    {
        id: 1,
        author: "Marie Dupont",
        avatar: "/images/team/avatar/Photo_Pro_avecOutline.png",
        content: "Nouveau projet déployé avec succès ! Stack : Next.js, TypeScript et Prisma. Les performances sont incroyables.",
        tags: ["nextjs", "typescript", "prisma"]
    },
    {
        id: 2,
        author: "Pierre Martin",
        avatar: "/images/team/avatar/Photo_Pro_avecOutline.png",
        content: "Qui a des bonnes pratiques pour optimiser les requêtes Prisma ? J'ai un problème de N+1 queries.",
        tags: ["prisma", "database", "optimization"]
    },
    {
        id: 3,
        author: "Sophie Bernard",
        avatar: "/images/team/avatar/Photo_Pro_avecOutline.png",
        content: "Superbe conférence sur React Server Components hier ! Quelqu'un a les slides ?",
        tags: ["react", "conference", "RSC"]
    },
    {
        id: 4,
        author: "Lucas Petit",
        avatar: "/images/team/avatar/Photo_Pro_avecOutline.png",
        content: "Nouveau tutoriel sur l'authentification avec Better Auth disponible sur mon blog !",
        tags: ["auth", "security", "tutorial"]
    },
    {
        id: 5,
        author: "Emma Leroy",
        avatar: "/images/team/avatar/Photo_Pro_avecOutline.png",
        content: "Des recommandations pour gérer les uploads de fichiers volumineux en Next.js ?",
        tags: ["nextjs", "upload", "files"]
    }
];

export default function PostsBlock({ className }: { className?: string }) {

    return (
        <Card className={cn("border border-neutral-400", className)}>
            <CardHeader className="flex items-center flex-col px-0">
                <div className="flex items-center justify-between w-full">
                    <CardTitle className='flex flex-wrap text-xl'>Les Publications</CardTitle>
                    <Button variant={"outline"} className="ml-auto shadow-lg-base cursor-pointer border-neutral-300">
                        <Plus className="w-4 h-4" />
                        <span>New Post</span>
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-20 rounded-sm px-0 overflow-hidden h-80">
                <Card className="p-2 pl-0 shadow-none">
                    <CardHeader className="px-0">
                        <CardTitle className="text-md">Bienvenue dans le flux de la communauté !</CardTitle>
                        <CardDescription>Partage ton court-métrage, ton sound design, ta voix off… et connecte-toi à des talents.</CardDescription>
                    </CardHeader>
                    <CardFooter className="px-0">
                        <Button variant="outline" size="sm" className="border bg-neutral-300 cursor-pointer text-xs">
                            Découvrir les communautés
                        </Button>
                    </CardFooter>
                </Card>
                <Card className="col-span-2 col-start-2 flex flex-col shadow-none pt-2 pb-0 gap-2 2xl:gap-4 overflow-hidden bg-transparent">
                    <CardHeader className="px-1">
                        <div className="flex flex-col gap-1">
                            <CardTitle className="text-md">Communautés suivies</CardTitle>
                            <CardDescription className="max-w-sm line-clamp-3">Découvrez les derniers posts de vos communautés que vous suivez</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="px-1 flex-1 overflow-y-auto flex flex-col gap-4 pr-4">
                        {communityPosts.map((post) => (
                            <Card key={post.id} className="border border-neutral-350 p-3 gap-4 shadow-lg-base">
                                <CardHeader className="flex items-center gap-1 px-0">
                                    <Image src={post.avatar} alt={post.author} width={50} height={50} className="w-8 h-8 rounded-full mr-2" />
                                    <CardTitle className="text-sm">{post.author}</CardTitle>
                                </CardHeader>
                                <CardContent className="px-0 h-8">
                                    <p className="text-sm text-neutral-500 line-clamp-2 max-w-64">{post.content}</p>
                                </CardContent>
                                <CardFooter className="flex items-center justify-between px-0">
                                    <div>
                                        {post.tags.map((tag, index) => (
                                            <span key={index} className="text-xs text-neutral-500 mr-2">#{tag}</span>
                                        ))}
                                    </div>
                                    <Button variant="secondary" size="sm" className="border bg-neutral-300 cursor-pointer">View</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </CardContent>
                </Card>
            </CardContent >
        </Card >
    );
}