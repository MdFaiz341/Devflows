/*
  Warnings:

  - You are about to drop the column `adminId` on the `CanvasRoom` table. All the data in the column will be lost.
  - You are about to drop the column `userid` on the `Content` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `role` to the `CanvasMember` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `CanvasRoom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CanvasUser" AS ENUM ('ADMIN', 'MEMBER');

-- DropForeignKey
ALTER TABLE "CanvasMember" DROP CONSTRAINT "CanvasMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "CanvasRoom" DROP CONSTRAINT "CanvasRoom_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_userid_fkey";

-- DropForeignKey
ALTER TABLE "ConversationMember" DROP CONSTRAINT "ConversationMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Page" DROP CONSTRAINT "Page_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Shape" DROP CONSTRAINT "Shape_userId_fkey";

-- AlterTable
ALTER TABLE "CanvasMember" ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "CanvasUser" NOT NULL,
ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "CanvasRoom" DROP COLUMN "adminId",
ADD COLUMN     "image" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "userid",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ConversationMember" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Message" ALTER COLUMN "senderId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Shape" ALTER COLUMN "userId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateIndex
CREATE INDEX "CanvasRoom_createdAt_idx" ON "CanvasRoom"("createdAt");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CanvasMember" ADD CONSTRAINT "CanvasMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shape" ADD CONSTRAINT "Shape_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMember" ADD CONSTRAINT "ConversationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
