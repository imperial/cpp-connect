/*
  Warnings:

  - Added the required column `deadline` to the `Opportunity` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Opportunity" ADD COLUMN     "deadline" TIMESTAMP(3) NOT NULL;
