/*
  Warnings:

  - The primary key for the `Company` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Company` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Opportunity` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `opportunityID` on the `Opportunity` table. All the data in the column will be lost.
  - Changed the type of `companyID` on the `Opportunity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Opportunity" DROP CONSTRAINT "Opportunity_companyID_fkey";

-- AlterTable
ALTER TABLE "Company" DROP CONSTRAINT "Company_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Company_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Opportunity" DROP CONSTRAINT "Opportunity_pkey",
DROP COLUMN "opportunityID",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "companyID",
ADD COLUMN     "companyID" INTEGER NOT NULL,
ADD CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
