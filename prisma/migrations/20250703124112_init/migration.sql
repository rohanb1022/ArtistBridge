/*
  Warnings:

  - You are about to drop the column `eventDate` on the `ArtistRequest` table. All the data in the column will be lost.
  - Added the required column `date` to the `ArtistRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArtistRequest" DROP COLUMN "eventDate",
ADD COLUMN     "date" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Booking" ALTER COLUMN "date" SET DATA TYPE TEXT;
