/*
  Warnings:

  - Made the column `name` on table `Conversation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `image` on table `Conversation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Conversation" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "image" SET NOT NULL;
