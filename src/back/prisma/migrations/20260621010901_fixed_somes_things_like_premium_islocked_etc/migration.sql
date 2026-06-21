/*
  Warnings:

  - The values [MESSAGES] on the enum `AdminEmailBox` will be removed. If these variants are still used in the database, this will fail.
  - The values [PREMIUM] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `isLocked` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `isPremium` on the `User` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdminEmailBox_new" AS ENUM ('SUPPORT', 'DEV');
ALTER TABLE "admin_emails" ALTER COLUMN "box" TYPE "AdminEmailBox_new" USING ("box"::text::"AdminEmailBox_new");
ALTER TYPE "AdminEmailBox" RENAME TO "AdminEmailBox_old";
ALTER TYPE "AdminEmailBox_new" RENAME TO "AdminEmailBox";
DROP TYPE "public"."AdminEmailBox_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'USER', 'MEMBER');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'MEMBER';
COMMIT;

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "isLocked";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isPremium",
ADD COLUMN     "passwordChangeToken" TEXT,
ADD COLUMN     "passwordChangeTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "pendingPasswordHash" TEXT;
