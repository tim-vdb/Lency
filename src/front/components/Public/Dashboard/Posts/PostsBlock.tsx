'use client';

import { Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "../../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../ui/card";

import 'swiper/css';
import CategoriesBar from "./CategoriesBar";

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

// Données mockées pour les posts populaires
const popularPosts = [
    {
        id: 1,
        author: "Tech Guru",
        avatar: "/images/team/avatar/Photo_Pro_avecOutline.png",
        content: "10 astuces pour améliorer les performances de vos applications Next.js en production !",
        tags: ["nextjs", "performance", "tips"]
    },
    {
        id: 2,
        author: "Dev Master",
        avatar: "/images/team/avatar/Photo_Pro_avecOutline.png",
        content: "TypeScript 5.4 est sorti avec des fonctionnalités incroyables ! Thread détaillé des nouveautés.",
        tags: ["typescript", "update", "features"]
    },
    {
        id: 3,
        author: "Code Lion",
        avatar: "/images/team/avatar/Photo_Pro_avecOutline.png",
        content: "Design patterns essentiels en React : Hook personnalisés vs Higher Order Components.",
        tags: ["react", "patterns", "hooks"]
    },
    {
        id: 4,
        author: "Sarah Dev",
        avatar: "/images/team/avatar/Photo_Pro_avecOutline.png",
        content: "Comment j'ai réduit le bundle size de mon app de 40% avec ces techniques simples.",
        tags: ["optimization", "bundle", "webpack"]
    },
    {
        id: 5,
        author: "Alex Code",
        avatar: "/images/team/avatar/Photo_Pro_avecOutline.png",
        content: "Guide complet : Migrer de Create React App vers Vite en moins de 30 minutes.",
        tags: ["vite", "migration", "guide"]
    }
];

export default function PostsBlock() {

    return (
        <Card className="col-[1/7] row-[1/5] shadow-lg-inset px-6 gap-6 ">
            <CardHeader className="flex items-center flex-col px-0">
                <div className="flex items-center justify-between w-full">
                    <CardTitle className='flex flex-wrap'>Posts</CardTitle>
                    <Button variant={"outline"} className="ml-auto shadow-lg-base cursor-pointer border-neutral-300">
                        <Plus className="w-4 h-4" />
                    </Button>
                </div>

                <CategoriesBar />
            </CardHeader>
            <CardContent className="grid grid-cols-5 gap-20 h-full rounded-sm px-0 overflow-hidden">
                <Card className="flex flex-col col-start-1 col-end-4 shadow-none p-2 gap-4 overflow-hidden">
                    <CardHeader className="flex items-start justify-between px-1 shrink-0">
                        <div className="flex flex-col gap-1">
                            <CardTitle className="text-md">Communautés</CardTitle>
                            <CardDescription className="max-w-sm line-clamp-3">Découvrez les derniers posts de vos communautés que vous suivez</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="border bg-neutral-300 cursor-pointer">Voir plus</Button>
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
                <Card className="flex flex-col col-start-4 col-end-6 gap-4 shadow-none py-0 p-2 overflow-hidden">
                    <CardHeader className="flex items-start justify-between px-1 shrink-0">
                        <div className="flex flex-col gap-1">
                            <CardTitle className="text-md">Populaire</CardTitle>
                            <CardDescription className="max-w-sm line-clamp-3">Découvrez les dernières tendances et les contenus populaires</CardDescription>
                        </div>
                        <Button variant="outline" size="sm" className="border bg-neutral-300 cursor-pointer">View All</Button>
                    </CardHeader>
                    <CardContent className="px-1 flex-1 overflow-y-auto flex flex-col gap-4 pr-4">
                        {popularPosts.map((post) => (
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
            </CardContent>
        </Card >
    );
}