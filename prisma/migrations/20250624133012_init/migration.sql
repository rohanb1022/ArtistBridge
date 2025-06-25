/*
  Warnings:

  - Added the required column `organizerId` to the `ArtistRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArtistRequest" ADD COLUMN     "organizerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "ArtistRequest" ADD CONSTRAINT "ArtistRequest_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "Organizer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
