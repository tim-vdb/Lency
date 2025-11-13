"use server"

import { prisma } from '@/lib/prisma'
import { actionClient } from '@/lib/safe-action-client'
import { getUser } from '@/lib/auth-session'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { ArticlesFormSchema } from './articles.schema'

export const ArticlesSafeAction = actionClient
    .inputSchema(ArticlesFormSchema)
    .action(async ({ parsedInput: input }) => {

        const user = await getUser();

        if (!user) {
            // throw new SafeError("Vous devez être connecté pour créer un article de blog");
            redirect('/login')
        }

        const blog = await prisma.blog.create({
            data: {
                title: input.title,
                content: input.content,
                excerpt: input.excerpt,
                image: input.image,
                slug: input.slug,
                published: input.published,
                authorId: user.id,
            }
        })

        console.log(blog)

        // Revalider les pages qui affichent les événements
        revalidatePath('/blog')

        return blog
    })
