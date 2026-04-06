-- CreateEnum
CREATE TYPE "PostFormat" AS ENUM ('DESKTOP', 'MOBILE', 'AUDIO');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "format" "PostFormat" NOT NULL DEFAULT 'DESKTOP';
