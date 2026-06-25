# syntax=docker/dockerfile:1

# ============================================================================
# Lency — Dockerfile multi-stage pour un déploiement hors Vercel
# (Railway, Fly.io, Render, un VPS Docker, Kubernetes…)
#
# Tout ce qui touche la DB (Doppler, Neon, ImageKit, Resend…) se configure
# via des variables d'environnement passées au conteneur au runtime.
# ============================================================================

# Image de base commune. node:22-alpine = musl → correspond au binaryTarget
# Prisma "linux-musl-openssl-3.0.x" déjà déclaré dans schema.prisma.
FROM node:22-alpine AS base
# OpenSSL est requis par le moteur Prisma.
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# ----------------------------------------------------------------------------
# 1. deps — installe toutes les dépendances (cache Docker sur les lockfiles)
# ----------------------------------------------------------------------------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ----------------------------------------------------------------------------
# 2. builder — génère le client Prisma puis build Next en mode standalone
# ----------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# prisma.config.ts résout env("DATABASE_URL") même pour `generate` (Prisma 7).
# `generate` ne se connecte pas à la DB : une URL factice suffit à faire passer
# l'étape de build. La vraie DATABASE_URL est injectée au runtime.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"

# Désactive la télémétrie Next pendant le build.
ENV NEXT_TELEMETRY_DISABLED=1

# Génère le client Prisma (schema défini dans prisma.config.ts → src/back/prisma).
RUN npx prisma generate

# Build Next. Les variables NEXT_PUBLIC_* nécessaires au build doivent être
# fournies ici en --build-arg si tu en as (sinon laisse tel quel).
RUN npm run build

# ----------------------------------------------------------------------------
# 3. migrate — image dédiée aux migrations (CLI Prisma + toolchain complète)
#    Lancée comme étape séparée (cf. service `migrate` dans docker-compose.yml ou
#    une étape de CI/CD) AVANT de démarrer le serveur. Garde l'image runner légère.
# ----------------------------------------------------------------------------
FROM base AS migrate
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src/back/prisma ./src/back/prisma
COPY --from=builder /app/src/back/generated ./src/back/generated
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder /app/package.json ./package.json
# Applique les migrations en attente. DATABASE_URL doit être fournie au runtime.
CMD ["npx", "prisma", "migrate", "deploy"]

# ----------------------------------------------------------------------------
# 4. runner — image finale minimale qui exécute le serveur Next standalone
# ----------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Utilisateur non-root pour le runtime.
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Assets publics.
COPY --from=builder /app/public ./public

# Sortie standalone de Next (serveur + node_modules minimal).
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Démarre uniquement le serveur Next (les migrations sont gérées par l'étape `migrate`).
CMD ["node", "server.js"]
