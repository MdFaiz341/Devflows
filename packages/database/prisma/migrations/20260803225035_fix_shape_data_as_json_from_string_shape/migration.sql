/*
  Warnings:

  - Added the required column `updatedAt` to the `Shape` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `Shape` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `data` on the `Shape` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ShapeType" AS ENUM ('rectangle', 'circle', 'line', 'arrow', 'pencil', 'text');

-- AlterTable
ALTER TABLE "Shape" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" "ShapeType" NOT NULL,
DROP COLUMN "data",
ADD COLUMN     "data" JSONB NOT NULL;
