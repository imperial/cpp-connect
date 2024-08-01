/*
  Warnings:

  - You are about to drop the column `aud` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "aud" UUID;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "aud";
