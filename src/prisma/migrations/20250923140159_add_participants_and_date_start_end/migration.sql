/*
 Warnings:
 
 - You are about to drop the column `date` on the `event` table. All the data in the column will be lost.
 - Added the required column `dateEnd` to the `event` table without a default value. This is not possible if the table is not empty.
 - Added the required column `dateStart` to the `event` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "public"."event" DROP COLUMN "date",
  ADD COLUMN "dateEnd" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "dateStart" TIMESTAMP(3) NOT NULL;
-- AlterTable
ALTER TABLE "public"."registration"
ADD COLUMN "participants" INTEGER NOT NULL DEFAULT 1;