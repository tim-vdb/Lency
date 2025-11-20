import { getUser } from '@/lib/auth-session';
import { prisma } from '@/lib/prisma';
import { BlogCard } from '@/features/Blog/GetBlog/components/BlogCard';

export default async function page() {
    const user = await getUser();

    const blogs = await prisma.blog.findMany({
        include: {
            author: true
        }
    });

    const isAdmin = user?.role === "ADMIN";

    return (
        <div>
            <h1 className='text-2xl font-bold'>Our Blog</h1>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-20'>
                {blogs.map((blog) => (
                    <div key={blog.id} className='container'>
                        <BlogCard blog={blog} isAdmin={isAdmin} />
                    </div>
                ))}
            </div>
        </div>
    );
}
