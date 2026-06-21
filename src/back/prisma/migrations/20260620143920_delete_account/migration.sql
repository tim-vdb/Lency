-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletionToken" TEXT,
ADD COLUMN     "deletionTokenExpiresAt" TIMESTAMP(3);
