/*
  Warnings:

  - A unique constraint covering the columns `[receiverName]` on the table `Dmstore` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `receiverName` to the `Dmstore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Dmstore" ADD COLUMN     "receiverName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dmstore_receiverName_key" ON "Dmstore"("receiverName");
