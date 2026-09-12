/*
  Warnings:

  - Added the required column `updatedAt` to the `Guest` table without a default value. This is not possible if the table is not empty.

*/

-- AlterTable
ALTER TABLE "Guest"
ADD COLUMN "preferredLanguage" TEXT,
ADD COLUMN "preferredRoomType" TEXT,
ADD COLUMN "specialRequests" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Guest_lastName_idx" ON "Guest"("lastName");

-- CreateIndex
CREATE INDEX "Guest_firstName_idx" ON "Guest"("firstName");