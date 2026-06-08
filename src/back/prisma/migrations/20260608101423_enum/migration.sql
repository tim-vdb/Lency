/*
  Warnings:

  - You are about to drop the column `subject` on the `Project` table. All the data in the column will be lost.
  - The `projectType` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('COURT_METRAGE', 'LONG_METRAGE', 'SERIE', 'CLIP', 'DOCUMENTAIRE', 'YOUTUBE', 'AUTRE');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "subject",
DROP COLUMN "projectType",
ADD COLUMN     "projectType" "ProjectType" NOT NULL DEFAULT 'AUTRE';

-- DropEnum
DROP TYPE "ProjectSubject";
