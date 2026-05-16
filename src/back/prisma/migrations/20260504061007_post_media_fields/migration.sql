-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "PostFormat" ADD VALUE 'IMAGE';
ALTER TYPE "PostFormat" ADD VALUE 'VIDEO';

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "audioUrl" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "videoUrl" TEXT;
