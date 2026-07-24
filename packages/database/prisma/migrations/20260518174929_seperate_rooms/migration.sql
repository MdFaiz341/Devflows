/*
  Warnings:

  - You are about to drop the `Member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Room` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Member" DROP CONSTRAINT "Member_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_adminId_fkey";

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "roomId" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Member";

-- DropTable
DROP TABLE "Room";

-- CreateTable
CREATE TABLE "CanvasMember" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,

    CONSTRAINT "CanvasMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatMember" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "roomId" TEXT NOT NULL,

    CONSTRAINT "ChatMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CanvasRoom" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "adminId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CanvasRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "adminId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CanvasRoom_name_key" ON "CanvasRoom"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ChatRoom_name_key" ON "ChatRoom"("name");

-- AddForeignKey
ALTER TABLE "CanvasMember" ADD CONSTRAINT "CanvasMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvasMember" ADD CONSTRAINT "CanvasMember_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "CanvasRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMember" ADD CONSTRAINT "ChatMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMember" ADD CONSTRAINT "ChatMember_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvasRoom" ADD CONSTRAINT "CanvasRoom_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "CanvasRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
