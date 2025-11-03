import React from 'react'

export default async function BlogPage({ params }: { params: { slug: string } }) {

    const { slug } = await params;

    // const blog = await prisma.blog.findUnique({
    //     where: { slug }
    // });

    return (
        <div>
            <p>Blog :</p>
            <p>{slug}</p>
        </div>
    )
}
