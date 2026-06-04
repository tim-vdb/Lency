import type { Metadata } from 'next';
// import { prisma } from '@/back/lib/prisma';
import React from 'react';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const title = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    return {
        title: `${title} — Blog Lency`,
        description: `Lisez l'article "${title}" sur le blog Lency.`,
    };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // const blog = await prisma.blog.findUnique({
  //   where: { slug },
  // });

  return (
    <div>
      <p>Blog :</p>
      <p>{slug}</p>
      {/* {blog ? (
        <div>
          <p>Article Présent !</p>
          <p>{blog.content}</p>
        </div>
      ) : (
        <p>Article Absent !</p>
      )} */}
    </div>
  );
}
