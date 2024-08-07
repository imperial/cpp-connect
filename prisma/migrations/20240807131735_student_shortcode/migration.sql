/*
  Warnings:

  - You are about to drop the column `eIDPreferredUsername` on the `User` table. All the data in the column will be lost.
  - Added the required column `studentShortcode` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "studentShortcode" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "eIDPreferredUsername";
