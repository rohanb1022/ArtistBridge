/*
  Warnings:

  - You are about to drop the column `priceRange` on the `Artist` table. All the data in the column will be lost.
  - The `category` column on the `Artist` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ArtistCategory" AS ENUM ('SINGER', 'DANCER', 'MAGICIAN', 'COMEDIAN', 'DJ', 'INSTRUMENTALIST', 'MIME', 'THEATRE', 'BEATBOXER', 'SPEAKER', 'PAINTER', 'POET', 'PHOTOGRAPHER', 'MODEL', 'CIRCUS');

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "priceRange",
ADD COLUMN     "price" INTEGER,
DROP COLUMN "category",
ADD COLUMN     "category" "ArtistCategory"[];
