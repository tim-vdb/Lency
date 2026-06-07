import type { Prisma } from "@/back/generated/prisma_client"

export type AdminUser = {
    id: string
    firstname: string | null
    lastname: string | null
    username: string | null
    email: string
    role: string
    isPremium: boolean
    isMarketplaceTalent: boolean
    emailVerified: boolean
    avatarUrl: string | null
    createdAt: Date | string
    _count: { Posts: number; projects: number; resources: number }
}

export type AdminProject = {
    id: string
    title: string
    description: string
    status: string
    subject: string
    visibility: string
    createdAt: Date | string
    owner: { id: string; firstname: string | null; lastname: string | null; username: string | null; avatarUrl: string | null }
    _count: { participants: number; applications: number; comments: number }
}

export type AdminCategory = {
    id: string
    name: string
    slug: string
    description: string | null
    visibility: string
    isNSFW: boolean
    postCount: number
    members: number
    subscriberCount: number
    createdAt: Date | string
    iconUrl: string | null
    creator: { id: string; firstname: string | null; lastname: string | null; username: string | null; avatarUrl: string | null }
}

export type AdminPost = {
    id: string
    content: string
    format: string
    isPublished: boolean
    isLocked: boolean
    viewCount: number
    upvoteCount: number
    commentCount: number
    saveCount: number
    createdAt: Date | string
    author: { id: string; firstname: string | null; lastname: string | null; username: string | null; avatarUrl: string | null }
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
    author: { id: string; firstname: string | null; lastname: string | null; username: string | null; avatarUrl: string | null }
    category: { id: string; name: string; slug: string }
}
