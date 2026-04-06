import { Button } from '@/front/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/front/components/ui/card'
import Image from 'next/image'

// Données mockées pour les posts de communautés
const communityPosts = [
    {
        id: 1,
        author: "Marie Dupont",
        avatar: "/images/team/avatar/Photo_Pro_avecOutline.png",
        content: "Nouveau projet déployé avec succès ! Stack : Next.js, TypeScript et Prisma. Les performances sont incroyables.",
        tags: ["nextjs", "typescript", "prisma"],
        image: "/images/blog/img1.jpg"
    },
    {
        id: 2,
        author: "Pierre Martin",
        avatar: "/images/team/avatar/Photo_Pro_avecOutline.png",
        content: "Qui a des bonnes pratiques pour optimiser les requêtes Prisma ? J'ai un problème de N+1 queries.",
        tags: ["prisma", "database", "optimization"],
        image: "/images/blog/img1.jpg"
    },
    {
        id: 3,
        author: "Sophie Bernard",
        avatar: "/images/team/avatar/Photo_Pro_avecOutline.png",
        content: "Superbe conférence sur React Server Components hier ! Quelqu'un a les slides ?",
        tags: ["react", "conference", "RSC"],
        image: "/images/blog/img1.jpg"
    },
    {
        id: 4,
        author: "Lucas Petit",
        avatar: "/images/team/avatar/Photo_Pro_avecOutline.png",
        content: "Nouveau tutoriel sur l'authentification avec Better Auth disponible sur mon blog !",
        tags: ["auth", "security", "tutorial"],
        image: "/images/blog/img1.jpg"
    },
    {
        id: 5,
        author: "Emma Leroy",
        avatar: "/images/team/avatar/Photo_Pro_avecOutline.png",
        content: "Des recommandations pour gérer les uploads de fichiers volumineux en Next.js ?",
        tags: ["nextjs", "upload", "files"],
        image: "/images/blog/img1.jpg"
    }
];

export default function PostsBlock() {
    return (
        <Card className="flex flex-col shadow-none pt-2 pb-0 gap-2 2xl:gap-4 w-full overflow-hidden bg-transparent rounded-none">
            <CardHeader className="px-1">
                <div className="flex justify-between gap-1">
                    <div className='flex flex-col gap-2'>
                        <CardTitle className="2xl:text-xl">Communautés suivies</CardTitle>
                        <CardDescription className="text-xs 2xl:text-base max-w-xs line-clamp-2">
                            Découvrez les derniers posts de vos communautés que vous suivez
                        </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="border bg-neutral-300 cursor-pointer text-xs">
                        View All
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="pl-1 overflow-y-auto flex flex-col gap-4 pr-4">
                {communityPosts.map((post) => (
                    <Card key={post.id} className="border border-neutral-350 p-3 gap-1 shadow-lg-base">
                        <CardHeader className="flex justify-between gap-1 px-0 h-18 2xl:h-20">
                            <div className="flex flex-col gap-1 2xl:gap-2 px-0">
                                <div>
                                    {post.tags.map((tag, index) => (
                                        <span key={index} className="text-[10px] text-neutral-500 mr-2 border px-0.5 py-1 rounded-sm hover:bg-neutral-100 cursor-pointer">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex">

                                </div>
                                <p className="text-xs 2xl:text-sm text-neutral-500 line-clamp-1 max-w-md">{post.content}</p>
                            </div>
                            <Image src={post?.image} alt={post.author} width={100} height={100} className="w-18 2xl:w-20 h-full 2xl:h-20 bg-contain rounded-md" />
                        </CardHeader>
                    </Card>
                ))}
            </CardContent>
        </Card>
    )
}
