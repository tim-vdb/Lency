-- DropForeignKey
ALTER TABLE "PostHide" DROP CONSTRAINT IF EXISTS "PostHide_userId_fkey";

-- DropForeignKey
ALTER TABLE "PostHide" DROP CONSTRAINT IF EXISTS "PostHide_postId_fkey";

-- DropTable
DROP TABLE IF EXISTS "PostHide";
