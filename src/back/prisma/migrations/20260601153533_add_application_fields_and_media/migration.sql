-- AlterTable
ALTER TABLE "DirectMessage" ADD COLUMN     "audioUrls" TEXT[],
ADD COLUMN     "imageUrls" TEXT[],
ADD COLUMN     "videoUrls" TEXT[];

-- AlterTable
ALTER TABLE "ProjectApplication" ADD COLUMN     "applicantNote" TEXT,
ADD COLUMN     "cvUrl" TEXT,
ADD COLUMN     "ownerNote" TEXT,
ADD COLUMN     "portfolioUrl" TEXT;

-- AlterTable
ALTER TABLE "ProjectMessage" ADD COLUMN     "audioUrls" TEXT[],
ADD COLUMN     "imageUrls" TEXT[],
ADD COLUMN     "videoUrls" TEXT[];
