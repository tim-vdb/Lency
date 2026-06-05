/*
  Warnings:

  - You are about to drop the column `audioUrl` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `Resource` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Resource` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProjectApplicationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "audioUrl",
DROP COLUMN "imageUrl",
DROP COLUMN "url",
DROP COLUMN "videoUrl",
ADD COLUMN     "audioUrls" TEXT[],
ADD COLUMN     "imageUrls" TEXT[],
ADD COLUMN     "urls" TEXT[],
ADD COLUMN     "videoUrls" TEXT[];

-- CreateTable
CREATE TABLE "ProjectApplication" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "status" "ProjectApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),

    CONSTRAINT "ProjectApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProjectApplication_projectId_idx" ON "ProjectApplication"("projectId");

-- CreateIndex
CREATE INDEX "ProjectApplication_userId_idx" ON "ProjectApplication"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectApplication_projectId_userId_key" ON "ProjectApplication"("projectId", "userId");

-- AddForeignKey
ALTER TABLE "ProjectApplication" ADD CONSTRAINT "ProjectApplication_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectApplication" ADD CONSTRAINT "ProjectApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
