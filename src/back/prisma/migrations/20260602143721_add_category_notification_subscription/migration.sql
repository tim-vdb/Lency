-- CreateTable
CREATE TABLE "CategoryNotificationSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CategoryNotificationSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CategoryNotificationSubscription_categoryId_idx" ON "CategoryNotificationSubscription"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryNotificationSubscription_userId_categoryId_key" ON "CategoryNotificationSubscription"("userId", "categoryId");

-- AddForeignKey
ALTER TABLE "CategoryNotificationSubscription" ADD CONSTRAINT "CategoryNotificationSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryNotificationSubscription" ADD CONSTRAINT "CategoryNotificationSubscription_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
