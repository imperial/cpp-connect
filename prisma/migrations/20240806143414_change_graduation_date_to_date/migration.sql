/*
  Warnings:

  - The `graduationDate` column on the `StudentProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "graduationDate",
ADD COLUMN     "graduationDate" TIMESTAMP(3);
