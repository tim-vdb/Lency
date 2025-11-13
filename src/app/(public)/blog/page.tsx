import { getUser } from '@/lib/auth-session';
import { prisma } from '@/lib/prisma';
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
                <div key={blog.id}>
                    <h2>{blog.title}</h2>
                    <p>{blog.content}</p>
                    <p>{blog.excerpt}</p>
                    <Image src={blog.image || ""} alt={blog.title} width={100} height={100} />
                    <p>{blog.published}</p>
                    <p>author : {blog.author.name}</p>
                </div>
            ))}
        </div>
    )
}
