/*
  Warnings:

  - The primary key for the `ChatRoom` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ChatRoom` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `roomId` column on the `Message` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `roomId` on the `ChatMember` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "ChatMember" DROP CONSTRAINT "ChatMember_roomId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_roomId_fkey";

-- AlterTable
ALTER TABLE "ChatMember" DROP COLUMN "roomId",
ADD COLUMN     "roomId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ChatRoom" DROP CONSTRAINT "ChatRoom_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "roomId",
ADD COLUMN     "roomId" INTEGER;

-- CreateIndex
CREATE INDEX "Message_roomId_idx" ON "Message"("roomId");

-- AddForeignKey
ALTER TABLE "ChatMember" ADD CONSTRAINT "ChatMember_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "ChatRoom"("id") ON DELETE SET NULL ON UPDATE CASCADE;
