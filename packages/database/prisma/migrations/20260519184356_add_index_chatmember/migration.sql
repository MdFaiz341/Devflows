-- CreateIndex
CREATE INDEX "CanvasMember_userId_idx" ON "CanvasMember"("userId");

-- CreateIndex
CREATE INDEX "CanvasMember_roomId_userId_idx" ON "CanvasMember"("roomId", "userId");

-- CreateIndex
CREATE INDEX "ChatMember_userId_idx" ON "ChatMember"("userId");

-- CreateIndex
CREATE INDEX "ChatMember_roomId_userId_idx" ON "ChatMember"("roomId", "userId");
