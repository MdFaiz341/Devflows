/*
  Warnings:

  - A unique constraint covering the columns `[roomId,userId]` on the table `CanvasMember` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "CanvasMember_roomId_userId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "CanvasMember_roomId_userId_key" ON "CanvasMember"("roomId", "userId");
