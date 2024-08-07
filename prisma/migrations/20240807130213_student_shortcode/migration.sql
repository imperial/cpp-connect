/*
  Warnings:

  - You are about to drop the column `eIDPreferredUsername` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "studentShortcode" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "eIDPreferredUsername";
