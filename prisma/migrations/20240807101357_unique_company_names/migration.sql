/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `CompanyProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CompanyProfile_name_key" ON "CompanyProfile"("name");
