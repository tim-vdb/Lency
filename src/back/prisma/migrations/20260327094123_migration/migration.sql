/*
  Warnings:

  - Added the required column `typeEvent` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TypeEvent" AS ENUM ('PHYSICAL', 'VIRTUAL');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "typeEvent" "TypeEvent" NOT NULL;

-- AlterTable
ALTER TABLE "Spot" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "Spot" ADD CONSTRAINT "Spot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
