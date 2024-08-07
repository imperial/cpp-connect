/*
  Warnings:

  - The `graduationDate` column on the `StudentProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `StudentProfile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StudentProfile" ADD COLUMN     "lookingFor" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "graduationDate",
ADD COLUMN     "graduationDate" TIMESTAMP(3);
