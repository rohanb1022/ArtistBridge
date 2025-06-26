/*
  Warnings:

  - Added the required column `timing` to the `ArtistRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArtistRequest" ADD COLUMN     "timing" TEXT NOT NULL;
