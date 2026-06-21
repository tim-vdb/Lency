-- CreateEnum
CREATE TYPE "AdminEmailBox" AS ENUM ('SUPPORT', 'DEV');

-- CreateEnum
CREATE TYPE "AdminEmailType" AS ENUM ('RECEIVED', 'SENT');

-- CreateTable
CREATE TABLE "admin_emails" (
    "id" TEXT NOT NULL,
    "messageId" TEXT,
    "type" "AdminEmailType" NOT NULL,
    "box" "AdminEmailBox" NOT NULL,
    "fromEmail" TEXT NOT NULL,
    "fromName" TEXT,
    "toEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "htmlContent" TEXT,
    "textContent" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isStarred" BOOLEAN NOT NULL DEFAULT false,
    "parentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_emails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_emails_messageId_key" ON "admin_emails"("messageId");

-- AddForeignKey
ALTER TABLE "admin_emails" ADD CONSTRAINT "admin_emails_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "admin_emails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
