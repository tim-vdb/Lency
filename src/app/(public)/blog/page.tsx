import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription, CardAction } from '@/components/ui/card';
import { getUser } from '@/lib/auth-session';
import { prisma } from '@/lib/prisma';
import { ArrowRightIcon, EyeIcon, SquarePen } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export default async function page() {
    const user = await getUser();

    const blogs = await prisma.blog.findMany({
        include: {
            author: true
        }
    });
    console.log(blogs);

    return (
        <div>
            {user?.role === "ADMIN" ? (
                <div>
                    <h1>Admin</h1>
                    <p>Créer un article ?</p>
                    <Link href="/admin/blog/create">Créer</Link>
                </div>
            ) : (
                <div>
                    <h1>User</h1>

                </div>
            )}
            {blogs.map((blog) => (
                <div key={blog.id} className='container'>
                    <Card className='group w-full max-w-sm pt-0'>
                        <CardHeader className='relative flex flex-col items-center justify-center px-0'>
                            <Image src={blog.image || ""} alt={blog.title} width={100} height={100} className='w-full max-h-64 object-cover rounded-t-xl' />
                            <p className='opacity-0 absolute transition-all duration-300 bottom-0 right-0 text-xs text-white-500 font-bold bg-neutral-900/75 rounded-tl-sm px-2 py-1 group-hover:opacity-100 group-hover:animate-slide-in-bottom group-hover:animate-duration-slow'>{blog.views} vues</p>
                            {user?.role === "ADMIN" && (
                                <SquarePen className='opacity-0 transition-all delay-200 duration-300 cursor-pointer size-9 absolute top-0 right-0 text-white-500 rounded-tr-xl backdrop-blur-xs bg-neutral-900/75 rounded-bl-sm p-1.5 outline outline-neutral-900 hover:[&_path]:animate-rotational-wave group-hover:opacity-100 group-hover:animate-slide-in-right group-hover:animate-delay-200' />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className='flex items-start justify-between'>
                                <CardTitle className='mb-5 text-2xl font-bold'>{blog.title}</CardTitle>
                                <div>
                                    <p className='text-sm text-neutral-500'>{blog.updatedAt.toLocaleDateString()}</p>
                                </div>
                            </div>
                            <CardDescription className='mb-5'>{blog.excerpt}</CardDescription>
                            <div className='flex items-end justify-between'>
                                <p className='text-xs text-neutral-500'>Par {blog.author.name}</p>
                                <Link href={`/blog/${blog.slug}`}>
                                    <Button variant='outline' className='w-full cursor-pointer hover:animate-squeeze'>
                                        <ArrowRightIcon className='w-4 h-4' />
                                        <span>Lire la suite</span>
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    )
}
