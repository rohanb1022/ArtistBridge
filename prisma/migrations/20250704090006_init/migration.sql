/*
  Warnings:

  - Made the column `artistName` on table `Booking` required. This step will fail if there are existing NULL values in that column.
  - Made the column `organizerName` on table `Booking` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "artistName" SET NOT NULL,
ALTER COLUMN "organizerName" SET NOT NULL;
