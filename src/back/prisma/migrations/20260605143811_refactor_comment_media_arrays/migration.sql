/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "imageUrl",
DROP COLUMN "videoUrl",
ADD COLUMN     "audioUrls" TEXT[],
ADD COLUMN     "imageUrls" TEXT[],
ADD COLUMN     "videoUrls" TEXT[];
