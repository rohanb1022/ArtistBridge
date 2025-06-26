/*
  Warnings:

  - Added the required column `category` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "BookingStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "category" TEXT NOT NULL;
