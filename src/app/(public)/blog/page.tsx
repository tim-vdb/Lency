
import { getUser } from '@/lib/auth-session';
import { prisma } from '@/lib/prisma';
import { BlogCard } from '@/features/Blog/GetBlog/components/BlogCard';
import Filter from '@/features/Filter/components/Filter';

export default async function page() {
    const user = await getUser();

    const blogs = await prisma.blog.findMany({
        include: {
            author: true
        }
    });

    const isAdmin = user?.role === "ADMIN";

    return (
        <div className='container'>
            <h1 className='text-2xl font-bold'>Our Blog</h1>
            <Filter blogs={blogs} isAdmin={isAdmin} />
        </div>
    );
}
