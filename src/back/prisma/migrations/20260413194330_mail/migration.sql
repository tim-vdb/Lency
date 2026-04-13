-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('SUPPORT_TECHNIQUE', 'CONTACT_GENERAL', 'FACTURATION', 'PARTENARIAT', 'AUTRE');

-- CreateEnum
CREATE TYPE "ContactStatus" AS ENUM ('EN_ATTENTE', 'EN_COURS', 'RESOLU', 'FERME');

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "prenom" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sujet" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "ContactType" NOT NULL DEFAULT 'CONTACT_GENERAL',
    "status" "ContactStatus" NOT NULL DEFAULT 'EN_ATTENTE',

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);
