-- CreateEnum
CREATE TYPE "MaintenancePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "MaintenanceHistoryType" AS ENUM (
    'CREATED',
    'UPDATED',
    'ASSIGNED',
    'UNASSIGNED',
    'PRIORITY_CHANGED',
    'DUE_DATE_CHANGED',
    'STATUS_CHANGED',
    'COMPLETED'
);

-- Drop old foreign key before renaming the column
ALTER TABLE "Maintenance"
DROP CONSTRAINT "Maintenance_userId_fkey";

-- Rename existing assignment column so existing data is preserved
ALTER TABLE "Maintenance"
RENAME COLUMN "userId" TO "assignedToId";

-- Add new Maintenance fields
ALTER TABLE "Maintenance"
ADD COLUMN "dueDate" TIMESTAMP(3),
ADD COLUMN "priority" "MaintenancePriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Remove the temporary database default.
-- Prisma's @updatedAt will manage future updates.
ALTER TABLE "Maintenance"
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- Create MaintenanceHistory
CREATE TABLE "MaintenanceHistory" (
    "id" TEXT NOT NULL,
    "type" "MaintenanceHistoryType" NOT NULL,
    "description" TEXT NOT NULL,
    "maintenanceId" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MaintenanceHistory_pkey" PRIMARY KEY ("id")
);

-- Re-create the assignment foreign key using the renamed column
ALTER TABLE "Maintenance"
ADD CONSTRAINT "Maintenance_assignedToId_fkey"
FOREIGN KEY ("assignedToId")
REFERENCES "User"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- MaintenanceHistory -> Maintenance
ALTER TABLE "MaintenanceHistory"
ADD CONSTRAINT "MaintenanceHistory_maintenanceId_fkey"
FOREIGN KEY ("maintenanceId")
REFERENCES "Maintenance"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- MaintenanceHistory -> User
ALTER TABLE "MaintenanceHistory"
ADD CONSTRAINT "MaintenanceHistory_userId_fkey"
FOREIGN KEY ("userId")
REFERENCES "User"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;