-- CreateTable
CREATE TABLE "LinkDuration" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "roomId" INTEGER NOT NULL,
    "linkVal" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LinkDuration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LinkDuration_userId_key" ON "LinkDuration"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "LinkDuration_linkVal_key" ON "LinkDuration"("linkVal");

-- CreateIndex
CREATE UNIQUE INDEX "LinkDuration_userId_roomId_key" ON "LinkDuration"("userId", "roomId");
