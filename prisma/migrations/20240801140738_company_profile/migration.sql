/*
  Warnings:

  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Opportunity" DROP CONSTRAINT "Opportunity_companyID_fkey";

-- DropTable
DROP TABLE "Company";

-- CreateTable
CREATE TABLE "CompanyProfile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "size" TEXT,
    "hq" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "founded" TEXT,

    CONSTRAINT "CompanyProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "CompanyProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
