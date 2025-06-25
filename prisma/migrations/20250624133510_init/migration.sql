/*
  Warnings:

  - Changed the type of `maxBudget` on the `ArtistRequest` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ArtistRequest" DROP COLUMN "maxBudget",
ADD COLUMN     "maxBudget" INTEGER NOT NULL;
