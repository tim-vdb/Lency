/*
  Warnings:

  - You are about to drop the column `eventId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Badge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Spot` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserBadge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Article" DROP CONSTRAINT "Article_authorId_fkey";

-- DropForeignKey
ALTER TABLE "Spot" DROP CONSTRAINT "Spot_mapLocationId_fkey";

-- DropForeignKey
ALTER TABLE "Spot" DROP CONSTRAINT "Spot_userId_fkey";

-- DropForeignKey
ALTER TABLE "_UserBadge" DROP CONSTRAINT "_UserBadge_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserBadge" DROP CONSTRAINT "_UserBadge_B_fkey";

-- DropForeignKey
ALTER TABLE "_UserEvent" DROP CONSTRAINT "_UserEvent_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserEvent" DROP CONSTRAINT "_UserEvent_B_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "eventId";

-- DropTable
DROP TABLE "Article";

-- DropTable
DROP TABLE "Badge";

-- DropTable
DROP TABLE "Event";

-- DropTable
DROP TABLE "Spot";

-- DropTable
DROP TABLE "_UserBadge";

-- DropTable
DROP TABLE "_UserEvent";

-- DropEnum
DROP TYPE "GalleryType";

-- DropEnum
DROP TYPE "TypeEvent";
