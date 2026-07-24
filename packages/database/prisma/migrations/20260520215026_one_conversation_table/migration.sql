/*
  Warnings:

  - You are about to drop the column `receiverId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `roomId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `ChatMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChatRoom` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Dmstore` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `conversationId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConversationType" AS ENUM ('DM', 'Group');

-- DropForeignKey
ALTER TABLE "ChatMember" DROP CONSTRAINT "ChatMember_roomId_fkey";

-- DropForeignKey
ALTER TABLE "ChatMember" DROP CONSTRAINT "ChatMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_adminId_fkey";

-- DropForeignKey
ALTER TABLE "Dmstore" DROP CONSTRAINT "Dmstore_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_roomId_fkey";

-- DropIndex
DROP INDEX "Message_roomId_idx";

-- DropIndex
DROP INDEX "Message_senderId_receiverId_idx";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "receiverId",
DROP COLUMN "roomId",
ADD COLUMN     "conversationId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "ChatMember";

-- DropTable
DROP TABLE "ChatRoom";

-- DropTable
DROP TABLE "Dmstore";

-- CreateTable
CREATE TABLE "Conversation" (
    "id" SERIAL NOT NULL,
    "type" "ConversationType" NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConversationMember" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_name_key" ON "Conversation"("name");

-- CreateIndex
CREATE INDEX "Conversation_updatedAt_idx" ON "Conversation"("updatedAt");

-- CreateIndex
CREATE INDEX "ConversationMember_userId_idx" ON "ConversationMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ConversationMember_conversationId_userId_key" ON "ConversationMember"("conversationId", "userId");

-- CreateIndex
CREATE INDEX "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");

-- AddForeignKey
ALTER TABLE "ConversationMember" ADD CONSTRAINT "ConversationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConversationMember" ADD CONSTRAINT "ConversationMember_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
