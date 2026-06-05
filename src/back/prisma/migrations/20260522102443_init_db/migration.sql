-- CreateEnum
CREATE TYPE "ProjectLevel" AS ENUM ('DEBUTANT', 'INTERMEDIAIRE', 'AVANCE');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('PRESENTIEL', 'DISTANCIEL', 'HYBRIDE');

-- CreateEnum
CREATE TYPE "RemunerationType" AS ENUM ('NON_REMUNERE', 'REMUNERE');

-- AlterTable: add marketplace fields to Project
ALTER TABLE "Project" ADD COLUMN "bannerUrl" TEXT;
ALTER TABLE "Project" ADD COLUMN "projectType" TEXT;
ALTER TABLE "Project" ADD COLUMN "remunerationType" "RemunerationType";
ALTER TABLE "Project" ADD COLUMN "level" "ProjectLevel";
ALTER TABLE "Project" ADD COLUMN "workMode" "WorkMode";
ALTER TABLE "Project" ADD COLUMN "startDate" TIMESTAMP(3);
ALTER TABLE "Project" ADD COLUMN "roles" JSONB;
ALTER TABLE "Project" ADD COLUMN "attachments" JSONB;
ALTER TABLE "Project" ADD COLUMN "commentCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Project" ADD COLUMN "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC';
