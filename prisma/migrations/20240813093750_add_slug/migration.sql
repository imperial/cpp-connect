/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `CompanyProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `CompanyProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "CompanyProfile_name_key";

-- AlterTable
ALTER TABLE "CompanyProfile" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_slug_key" ON "CompanyProfile"("slug");
