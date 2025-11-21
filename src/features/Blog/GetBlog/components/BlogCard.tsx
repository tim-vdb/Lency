import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Blog, User } from '@/generated/prisma_client';
import { ArrowRightIcon, FileCheck, FileX, SeparatorVertical, SquarePen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface BlogCardProps {
    blog: Blog & { author: User };
    isAdmin: boolean;
}

export function BlogCard({ blog, isAdmin }: BlogCardProps) {
    const texte = blog?.content?.trim();
    const mots = texte?.split(/\s+/);
    const nbMots = texte === "" ? 0 : mots?.length;
    const timeToRead = Math.ceil((nbMots ?? 0) / 200);


    return (
        <Card className='group w-full h-full max-w-sm pt-0 max-h-[450px] shadow-lg'>
            <CardHeader className='relative flex flex-col max-h-[240px] min-h-[240px] rounded-t-xl items-center justify-center px-0 overflow-hidden'>
                <Image
                    src={blog.image || ""}
                    alt={blog.title}
                    width={400}
                    height={256}
                    className='max-h-64 w-full h-full object-cover scale-115 group-hover:scale-100 transition-transform duration-800 delay-300 group-hover:delay-0 group-hover:duration-500'
                />
                {isAdmin ? (
                    <div className='flex items-center justify-between gap-2 opacity-0 text-white absolute bottom-0 right-0 text-xs text-white-500 font-bold w-full bg-neutral-900/75 px-2 py-1 transition-opacity duration-1000 delay-300 group-hover:opacity-100 group-hover:duration-200 group-hover:delay-0 group-hover:animate-slide-in-bottom group-hover:animate-duration-slow'>
                        <p>
                            Mis à jour le {" "} {blog.updatedAt.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <p>
                            {blog.views} vues
                        </p>
                    </div>
                ) : (
                    <div className='flex items-center justify-between gap-2 opacity-0 text-white absolute bottom-0 right-0 text-xs text-white-500 font-bold w-full bg-neutral-900/75 px-2 py-1 transition-opacity duration-1000 delay-300 group-hover:opacity-100 group-hover:duration-200 group-hover:delay-0 group-hover:animate-slide-in-bottom group-hover:animate-duration-slow'>
                        <p>
                            Mis à jour le {" "} {blog.updatedAt.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        <p>
                            {timeToRead} min de lecture
                        </p>
                    </div>

                )}
                {isAdmin && (
                    <>
                        <div title="Modifier l'article" className='opacity-0 absolute top-0 right-0 transition-opacity duration-500 delay-300 group-hover:opacity-100 group-hover:duration-200 group-hover:delay-0 group-hover:animate-slide-in-right'>
                            <SquarePen className='cursor-pointer text-white size-9 text-white-500 rounded-tr-xl backdrop-blur-xs bg-neutral-900/75 rounded-bl-sm p-1.5 outline outline-neutral-900 hover:[&_path]:animate-rotational-wave' />
                        </div>

                        <div title="Article publié" className='absolute top-0 left-0 transition-opacity duration-500 delay-300 group-hover:opacity-100 group-hover:duration-200 group-hover:delay-0'>
                            {blog.published ? (
                                <FileCheck className='cursor-pointer text-white size-9 text-white-500 rounded-tl-xl backdrop-blur-xs bg-green-900/75 rounded-br-sm p-1.5 outline outline-neutral-900' />
                            ) : (
                                <FileX className='cursor-pointer text-white size-9 text-white-500 rounded-tl-xl backdrop-blur-xs bg-red-800/75 dark:bg-red-800/75 rounded-br-sm p-1.5 outline outline-neutral-900 [&_path]:animate-[pulse_1s_ease-in-out_infinite_alternate]' />
                            )}
                        </div>
                    </>
                )}
            </CardHeader>

            <CardContent className='flex flex-col justify-between h-full'>
                <div>
                    <CardTitle className='mb-5 text-xl font-bold truncate'>{blog.title}</CardTitle>

                    <CardDescription className='mb-5 line-clamp-3'>
                        {blog.excerpt}
                    </CardDescription>
                </div>

                <div className='flex items-end justify-between'>
                    <p className='text-xs text-neutral-500'>Par {blog.author.name}</p>
                    <Link href={`/blog/${blog.slug}`}>
                        <Button variant='default' className='w-full cursor-pointer hover:animate-[squeeze_0.6s_ease-in-out_infinite]'>
                            <ArrowRightIcon className='w-4 h-4' />
                            <p>Lire la suite</p>
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

