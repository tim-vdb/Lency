import type { Prisma } from "@/back/generated/prisma_client"

export type AdminUser = {
    id: string
    firstname: string | null
    lastname: string | null
    username: string | null
    email: string
    role: string
    isMarketplaceTalent: boolean
    emailVerified: boolean
    image: string | null
    avatarUrl: string | null
    createdAt: Date | string
    _count: { Posts: number; projects: number; resources: number; creator: number }
}

export type AdminProject = {
    id: string
    title: string
    description: string
    status: string
    visibility: string
    createdAt: Date | string
    owner: { id: string; firstname: string | null; lastname: string | null; username: string | null; avatarUrl: string | null; image: string | null }
    _count: { participants: number; applications: number; comments: number }
}

export type AdminCategory = {
    id: string
    name: string
    slug: string
    description: string | null
    createdAt: Date | string
    iconUrl: string | null
    _count: { posts: number; ressources: number; followers: number }
    creator: { id: string; firstname: string | null; lastname: string | null; username: string | null; avatarUrl: string | null; image: string | null }
}

export type AdminPost = {
    id: string
    content: string
    format: string
    isPublished: boolean
    viewCount: number
    upvoteCount: number
    commentCount: number
    saveCount: number
    createdAt: Date | string
    author: { id: string; firstname: string | null; lastname: string | null; username: string | null; image: string | null; avatarUrl: string | null }
    category: { id: string; name: string; slug: string }
}

export type AdminResource = {
    id: string
    title: string
    description: string | null
    type: string
    urls: string[]
    upvoteCount: number
    saveCount: number
    commentCount: number
    viewCount: number
    createdAt: Date | string
    author: { id: string; firstname: string | null; lastname: string | null; username: string | null; image: string | null; avatarUrl: string | null }
    category: { id: string; name: string; slug: string }
}
