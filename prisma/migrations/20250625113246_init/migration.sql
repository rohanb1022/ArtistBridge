/*
  Warnings:

  - You are about to drop the column `BookedDates` on the `Artist` table. All the data in the column will be lost.
  - Added the required column `time` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "BookedDates";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "time" TEXT NOT NULL;
