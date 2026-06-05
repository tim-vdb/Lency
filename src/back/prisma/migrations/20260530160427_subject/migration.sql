-- CreateEnum
CREATE TYPE "ProjectSubject" AS ENUM ('Tout', 'Vidéo', 'Motion', 'Photo', 'Outils');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "subject" "ProjectSubject" NOT NULL DEFAULT 'Tout';
