-- DropForeignKey
ALTER TABLE "UserConfig" DROP CONSTRAINT "UserConfig_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserConfig" ADD CONSTRAINT "UserConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
