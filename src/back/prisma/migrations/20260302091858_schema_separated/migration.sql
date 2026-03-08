/*
  Warnings:

  - You are about to drop the `Gallery` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `account` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `blog` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `newsletter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `registration` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `verification` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "account" DROP CONSTRAINT "account_userId_fkey";

-- DropForeignKey
ALTER TABLE "blog" DROP CONSTRAINT "blog_authorId_fkey";

-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "registration" DROP CONSTRAINT "registration_eventId_fkey";

-- DropForeignKey
ALTER TABLE "registration" DROP CONSTRAINT "registration_userId_fkey";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "session_userId_fkey";

-- DropTable
DROP TABLE "Gallery";

-- DropTable
DROP TABLE "account";

-- DropTable
DROP TABLE "blog";

-- DropTable
DROP TABLE "event";

-- DropTable
DROP TABLE "newsletter";

-- DropTable
DROP TABLE "registration";

-- DropTable
DROP TABLE "session";

-- DropTable
DROP TABLE "user";

-- DropTable
DROP TABLE "verification";

-- DropEnum
DROP TYPE "GalleryType";

-- DropEnum
DROP TYPE "Role";
