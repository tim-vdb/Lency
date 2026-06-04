import prisma from "../lib/prisma";

type FtsRow = {
    id: string;
    type: "project" | "category" | "post" | "resource";
    score: number;
    excerpt: string;
};

// Options ts_headline communes — extrait de 8-20 mots, marqueurs «»
const HEADLINE_OPTS = "StartSel=«, StopSel=», MaxWords=20, MinWords=8, HighlightAll=FALSE";

export const SearchService = {
    search: async (query: string, limit = 5) => {
        // Sans requête : afficher récents / populaires via Prisma (pas de FTS nécessaire)
        if (!query || query.length < 2) {
            const [recentProjects, recentCategories] = await Promise.all([
                prisma.project.findMany({
                    where: { visibility: "PUBLIC", status: "PUBLISHED" },
                    include: { owner: true, participants: true, mapLocation: true },
                    orderBy: { createdAt: "desc" },
                    take: limit,
                }),
                prisma.category.findMany({
                    orderBy: { createdAt: "desc" },
                    take: limit,
                }),
            ]);
            return {
                projects: recentProjects.map(p => ({ ...p, excerpt: "" })),
                categories: recentCategories.map(c => ({ ...c, excerpt: "" })),
                posts: [],
                resources: [],
            };
        }

        /*
         * Requête SQL brute — impossible à exprimer avec l'API Prisma :
         *
         * 1. to_tsvector / plainto_tsquery : tokenisation + stemming en français
         * 2. setweight : pondération titre (A) > description (B) pour le ranking
         * 3. ts_rank : score de pertinence flottant entre 0 et 1
         * 4. ts_headline : extrait contextuel avec les termes trouvés mis en évidence
         * 5. UNION ALL cross-table : une seule passe sur 4 tables, triée globalement par score
         *
         * Prisma ne peut pas : pondérer des vecteurs, ranker entre tables, ni générer des extraits.
         */
        const rows = await prisma.$queryRaw<FtsRow[]>`
            SELECT
                id,
                'project'::text AS type,
                ts_rank(
                    setweight(to_tsvector('french', title), 'A') ||
                    setweight(to_tsvector('french', description), 'B'),
                    plainto_tsquery('french', ${query})
                )::float8 AS score,
                ts_headline('french', description, plainto_tsquery('french', ${query}), ${HEADLINE_OPTS}) AS excerpt
            FROM "Project"
            WHERE
                visibility = 'PUBLIC'
                AND status = 'PUBLISHED'
                AND (
                    setweight(to_tsvector('french', title), 'A') ||
                    setweight(to_tsvector('french', description), 'B')
                ) @@ plainto_tsquery('french', ${query})

            UNION ALL

            SELECT
                id,
                'category'::text AS type,
                ts_rank(
                    to_tsvector('french', name || ' ' || COALESCE(description, '')),
                    plainto_tsquery('french', ${query})
                )::float8 AS score,
                ts_headline(
                    'french',
                    COALESCE(description, name),
                    plainto_tsquery('french', ${query}),
                    ${HEADLINE_OPTS}
                ) AS excerpt
            FROM "Category"
            WHERE
                to_tsvector('french', name || ' ' || COALESCE(description, ''))
                @@ plainto_tsquery('french', ${query})

            UNION ALL

            SELECT
                id,
                'post'::text AS type,
                ts_rank(
                    to_tsvector('french', content),
                    plainto_tsquery('french', ${query})
                )::float8 AS score,
                ts_headline('french', content, plainto_tsquery('french', ${query}), ${HEADLINE_OPTS}) AS excerpt
            FROM "Post"
            WHERE
                "isPublished" = true
                AND to_tsvector('french', content) @@ plainto_tsquery('french', ${query})

            UNION ALL

            SELECT
                id,
                'resource'::text AS type,
                ts_rank(
                    setweight(to_tsvector('french', title), 'A') ||
                    setweight(to_tsvector('french', COALESCE(description, '')), 'B'),
                    plainto_tsquery('french', ${query})
                )::float8 AS score,
                ts_headline(
                    'french',
                    COALESCE(description, title),
                    plainto_tsquery('french', ${query}),
                    ${HEADLINE_OPTS}
                ) AS excerpt
            FROM "Resource"
            WHERE (
                setweight(to_tsvector('french', title), 'A') ||
                setweight(to_tsvector('french', COALESCE(description, '')), 'B')
            ) @@ plainto_tsquery('french', ${query})

            ORDER BY score DESC
            LIMIT ${limit * 4}
        `;

        const byType = (type: FtsRow["type"]) =>
            rows.filter(r => r.type === type).slice(0, limit);

        const projectRows  = byType("project");
        const categoryRows = byType("category");
        const postRows     = byType("post");
        const resourceRows = byType("resource");

        const excerptOf = (id: string) => rows.find(r => r.id === id)?.excerpt ?? "";

        const [projects, categories, posts, resources] = await Promise.all([
            projectRows.length
                ? prisma.project.findMany({
                    where: { id: { in: projectRows.map(r => r.id) } },
                    include: { owner: true, participants: true, mapLocation: true },
                  })
                : [],
            categoryRows.length
                ? prisma.category.findMany({ where: { id: { in: categoryRows.map(r => r.id) } } })
                : [],
            postRows.length
                ? prisma.post.findMany({
                    where: { id: { in: postRows.map(r => r.id) } },
                    include: { author: true, category: true },
                  })
                : [],
            resourceRows.length
                ? prisma.resource.findMany({
                    where: { id: { in: resourceRows.map(r => r.id) } },
                    include: { author: true, category: true },
                  })
                : [],
        ]);

        const ranked = <T extends { id: string }>(items: T[], ftsRows: FtsRow[]) =>
            ftsRows
                .map(r => items.find(i => i.id === r.id))
                .filter((i): i is T => i !== undefined)
                .map(i => ({ ...i, excerpt: excerptOf(i.id) }));

        return {
            projects:   ranked(projects, projectRows),
            categories: ranked(categories, categoryRows),
            posts:      ranked(posts, postRows),
            resources:  ranked(resources, resourceRows),
        };
    },
};
