import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog — Lency',
    description: 'Actualités, conseils et inspirations pour les créatifs audiovisuels sur le blog Lency.',
};

// import { getUser } from '@/back/lib/auth-session';
// import { prisma } from '@/back/lib/prisma';
// import Filter from '@/front/components/Filter/Filter';

export default async function page() {
  // const user = await getUser();

  // const blogs = await prisma.blog.findMany({
  //   include: {
  //     author: true,
  //   },
  // });

  // const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="container">
      <h1 className="text-2xl font-bold">Our Blog</h1>
      {/* <Filter blogs={blogs} isAdmin={isAdmin} /> */}
    </div>
  );
}
