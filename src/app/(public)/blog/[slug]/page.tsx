import { prisma } from '@/lib/prisma';
import React from 'react';

export default async function BlogPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;

  const blog = await prisma.blog.findUnique({
    where: { slug },
  });

  return (
    <div>
      <p>Blog :</p>
      <p>{slug}</p>
      {blog ? (
        <div>
          <p>Article Présent !</p>
          <p>{blog.content}</p>
        </div>
      ) : (
        <p>Article Absent !</p>
      )}
    </div>
  );
}
