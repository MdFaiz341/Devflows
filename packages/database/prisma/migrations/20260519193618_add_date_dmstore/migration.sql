-- AlterTable
ALTER TABLE "Dmstore" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "Dmstore_senderId_idx" ON "Dmstore"("senderId");
