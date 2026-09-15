-- AlterTable
ALTER TABLE "Operation" ADD COLUMN     "reservationId" TEXT;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
