-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "audioUrl" TEXT,
ADD COLUMN     "videoUrl" TEXT,
ALTER COLUMN "url" DROP NOT NULL;
