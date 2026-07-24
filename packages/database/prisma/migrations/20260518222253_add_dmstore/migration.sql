-- CreateTable
CREATE TABLE "Dmstore" (
    "id" SERIAL NOT NULL,
    "senderId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,

    CONSTRAINT "Dmstore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Dmstore" ADD CONSTRAINT "Dmstore_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
