/* eslint-disable no-console */
import { prisma } from "../lib/prisma"
import { hashPassword } from "better-auth/crypto"

async function main() {
    console.log("🌱 Seeding database...")

    // ─── Users ───────────────────────────────────────────────────────────────
    const password = await hashPassword("password123")

    const admin = await prisma.user.upsert({
        where: { email: "admin@lency.dev" },
        update: {},
        create: {
            email: "admin@lency.dev",
            firstname: "Admin",
            lastname: "Lency",
            username: "admin",
            role: "ADMIN",
            emailVerified: true,
            image: null,
        },
    })

    const user1 = await prisma.user.upsert({
        where: { email: "tim@lency.dev" },
        update: {},
        create: {
            email: "tim@lency.dev",
            firstname: "Timothée",
            lastname: "Van Den Bosch",
            username: "timvdb",
            role: "MEMBER",
            emailVerified: true,
            image: null,
        },
    })

    const user2 = await prisma.user.upsert({
        where: { email: "guerric@lency.dev" },
        update: {},
        create: {
            email: "guerric@lency.dev",
            firstname: "Guerric",
            lastname: "Cochelin",
            username: "guerric",
            role: "MEMBER",
            emailVerified: true,
            image: null,
        },
    })

    const userBasic = await prisma.user.upsert({
        where: { email: "user@lency.dev" },
        update: {},
        create: {
            email: "user@lency.dev",
            firstname: "Alex",
            lastname: "Dupont",
            username: "alexdupont",
            role: "USER",
            emailVerified: false,
            image: null,
        },
    })

    const userPremium = await prisma.user.upsert({
        where: { email: "premium@lency.dev" },
        update: {},
        create: {
            email: "premium@lency.dev",
            firstname: "Sophie",
            lastname: "Martin",
            username: "sophiemartin",
            role: "PREMIUM",
            emailVerified: true,
            image: null,
        },
    })

    // ─── Accounts (passwords pour better-auth) ───────────────────────────────
    for (const user of [admin, user1, user2, userBasic, userPremium]) {
        await prisma.account.upsert({
            where: { id: `credential-${user.id}` },
            update: {},
            create: {
                id: `credential-${user.id}`,
                accountId: user.id,
                providerId: "credential",
                userId: user.id,
                password,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        })
    }

    console.log("✅ Users created")

    // ─── Categories ──────────────────────────────────────────────────────────

    const catGeneral = await prisma.category.upsert({
        where: { slug: "general" },
        update: {},
        create: {
            name: "Général",
            slug: "general",
            description: "Discussions générales sur la communauté",
            visibility: "PUBLIC",
            createdBy: admin.id,
        },
    })

    const catDesign = await prisma.category.upsert({
        where: { slug: "design" },
        update: {},
        create: {
            name: "Design",
            slug: "design",
            description: "Tout sur le design UI/UX",
            visibility: "PUBLIC",
            createdBy: admin.id,
        },
    })

    const catDev = await prisma.category.upsert({
        where: { slug: "developpement" },
        update: {},
        create: {
            name: "Développement",
            slug: "developpement",
            description: "Discussions techniques et développement",
            visibility: "PUBLIC",
            createdBy: admin.id,
        },
    })

    console.log("✅ Categories created")

    // ─── Posts ────────────────────────────────────────────────────────────────

    const post1 = await prisma.post.create({
        data: {
            content: "Salut à tous ! Bienvenue sur la plateforme Lency. N'hésitez pas à vous présenter et à partager vos projets.",
            categoryId: catGeneral.id,
            authorId: admin.id,
            format: "TEXT",
            isPublished: true,
        },
    })

    await prisma.post.create({
        data: {
            content: "Quelles sont vos tendances design préférées cette année ? Personnellement je suis fan du retour au flat design avec des touches de glassmorphism.",
            categoryId: catDesign.id,
            authorId: user1.id,
            format: "TEXT",
            isPublished: true,
        },
    })

    await prisma.post.create({
        data: {
            content: "On utilise cette stack sur Lency et franchement c'est un game changer. Le combo Server Components + Prisma est vraiment performant.",
            categoryId: catDev.id,
            authorId: user2.id,
            format: "TEXT",
            isPublished: true,
        },
    })

    await prisma.post.create({
        data: {
            content: "Je viens de refaire mon portfolio, vous en pensez quoi ? Je suis preneur de tout retour constructif !",
            categoryId: catDesign.id,
            authorId: user1.id,
            format: "TEXT",
            isPublished: true,
        },
    })

    await prisma.post.create({
        data: {
            content: "L'accessibilité est souvent reléguée au second plan alors qu'elle devrait être pensée dès le départ. Voici quelques pratiques simples qui changent vraiment la vie : utiliser des contrastes suffisants, baliser correctement ses composants avec ARIA, et tester avec un lecteur d'écran. Ces petites attentions permettent de rendre le web utilisable par tous, y compris les personnes en situation de handicap.",
            categoryId: catDev.id,
            authorId: user2.id,
            format: "TEXT",
            isPublished: true,
        },
    })

    await prisma.post.create({
        data: {
            content: "J'étais à la conf Design System Paris la semaine dernière, voici un résumé audio de mes impressions. Les talks sur les tokens de design et la collaboration design/dev étaient particulièrement intéressants.",
            categoryId: catDesign.id,
            authorId: admin.id,
            format: "AUDIO",
            isPublished: true,
        },
    })

    await prisma.post.create({
        data: {
            content: "Je viens de rejoindre la plateforme et je suis bluffé par la qualité de la communauté. Hâte de découvrir tout ce que vous partagez ici !",
            categoryId: catGeneral.id,
            authorId: userBasic.id,
            format: "TEXT",
            isPublished: true,
        },
    })

    await prisma.post.create({
        data: {
            content: "Ça fait deux mois que j'ai le compte premium et franchement les ressources exclusives valent vraiment le coup. Le contenu avancé sur Figma m'a fait gagner un temps fou sur mes projets clients.",
            categoryId: catDesign.id,
            authorId: userPremium.id,
            format: "TEXT",
            isPublished: true,
        },
    })

    await prisma.post.create({
        data: {
            content: "Un épisode complet sur les transitions, keyframes et performances d'animation. Idéal pour écouter en codant.",
            categoryId: catDev.id,
            authorId: userPremium.id,
            format: "AUDIO",
            isPublished: true,
        },
    })

    // await prisma.post.create({
    //     data: {
    //         content: "Aperçu de mon setup de développement 2026 — dual screen, mécanique, lumière ambiante. La productivité passe aussi par le confort !",
    //         categoryId: catDev.id,
    //         authorId: user1.id,
    //         format: "IMAGE",
    //         orientation: "LANDSCAPE",
    //         imageUrl: null,
    //         isPublished: true,
    //     },
    // })

    // await prisma.post.create({
    //     data: {
    //         content: "Shot de ma moodboard pour le prochain projet branding. Palette chaude, typo serif et beaucoup de texture.",
    //         categoryId: catDesign.id,
    //         authorId: user2.id,
    //         format: "IMAGE",
    //         orientation: "PORTRAIT",
    //         imageUrl: null,
    //         isPublished: true,
    //     },
    // })

    // await prisma.post.create({
    //     data: {
    //         content: "Démo rapide de mon composant de drag-and-drop en React — sans librairie externe, juste du HTML5 drag API. Feedback bienvenu !",
    //         categoryId: catDev.id,
    //         authorId: admin.id,
    //         format: "VIDEO",
    //         orientation: "LANDSCAPE",
    //         videoUrl: null,
    //         isPublished: true,
    //     },
    // })

    // await prisma.post.create({
    //     data: {
    //         content: "Timelapse de la création d'une illustration pour un client — de l'esquisse au rendu final en 60 secondes.",
    //         categoryId: catDesign.id,
    //         authorId: userPremium.id,
    //         format: "VIDEO",
    //         orientation: "PORTRAIT",
    //         videoUrl: null,
    //         isPublished: true,
    //     },
    // })

    console.log("✅ Posts created")

    // ─── Comments ────────────────────────────────────────────────────────────

    const comment1 = await prisma.comment.create({
        data: {
            content: "Merci pour l'accueil ! Hâte de voir la suite 🚀",
            postId: post1.id,
            authorId: user1.id,
        },
    })

    await prisma.comment.create({
        data: {
            content: "Bienvenue à toi !",
            postId: post1.id,
            authorId: admin.id,
            parentId: comment1.id,
        },
    })

    // Mettre à jour les compteurs de commentaires
    const postsWithComments = await prisma.post.findMany({
        include: { _count: { select: { comments: true } } },
    })

    for (const post of postsWithComments) {
        await prisma.post.update({
            where: { id: post.id },
            data: { commentCount: post._count.comments },
        })
    }

    console.log("✅ Comments created")
    console.log("🌱 Seed completed!")
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect?.())
