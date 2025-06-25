/*
  Warnings:

  - You are about to drop the column `ArtistCateogry` on the `Organizer` table. All the data in the column will be lost.
  - You are about to drop the column `eventDetail` on the `Organizer` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "RequestStatus" AS ENUM ('PENDING', 'MATCHED', 'NOTIFIED');

-- AlterTable
ALTER TABLE "Organizer" DROP COLUMN "ArtistCateogry",
DROP COLUMN "eventDetail";

-- CreateTable
CREATE TABLE "ArtistRequest" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "maxBudget" TEXT NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "status" "RequestStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ArtistRequest_pkey" PRIMARY KEY ("id")
);
