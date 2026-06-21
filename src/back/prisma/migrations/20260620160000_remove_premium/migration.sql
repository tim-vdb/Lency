-- isPremium column and PREMIUM role update already applied in a previous partial run.
-- Role_old type exists (renamed from Role), new Role type exists with 3 values.
-- This migration completes the enum swap and cleans up.

ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role" USING "role"::text::"Role";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'MEMBER'::"Role";
DROP TYPE IF EXISTS "Role_old";
