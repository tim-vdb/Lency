-- CreateEnum
CREATE TYPE "PostOrientation" AS ENUM ('LANDSCAPE', 'PORTRAIT');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN "orientation" "PostOrientation" NOT NULL DEFAULT 'LANDSCAPE';

-- Convert legacy DESKTOP posts (image landscape) → format=IMAGE, orientation=LANDSCAPE
UPDATE "Post" SET "format" = 'IMAGE', "orientation" = 'LANDSCAPE' WHERE "format" = 'DESKTOP';

-- Convert legacy MOBILE posts (portrait) → format=VIDEO, orientation=PORTRAIT
UPDATE "Post" SET "format" = 'VIDEO', "orientation" = 'PORTRAIT' WHERE "format" = 'MOBILE';
