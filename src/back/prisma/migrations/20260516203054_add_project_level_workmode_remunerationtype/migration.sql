-- CreateEnum
CREATE TYPE "ProjectLevel" AS ENUM ('DEBUTANT', 'INTERMEDIAIRE', 'AVANCE');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('PRESENTIEL', 'DISTANCIEL', 'HYBRIDE');

-- CreateEnum
CREATE TYPE "RemunerationType" AS ENUM ('NON_REMUNERE', 'REMUNERE');

-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "projectId" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "attachments" JSONB,
ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "commentCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "level" "ProjectLevel",
ADD COLUMN     "projectType" TEXT,
ADD COLUMN     "remunerationType" "RemunerationType",
ADD COLUMN     "roles" JSONB,
ADD COLUMN     "startDate" TIMESTAMP(3),
ADD COLUMN     "visibility" "Visibility" NOT NULL DEFAULT 'PUBLIC',
ADD COLUMN     "workMode" "WorkMode";

-- CreateIndex
CREATE INDEX "Comment_projectId_idx" ON "Comment"("projectId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
