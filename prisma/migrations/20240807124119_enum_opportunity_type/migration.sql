/*
  Warnings:

  - The `lookingFor` column on the `StudentProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `Opportunity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OpportunityType" AS ENUM ('Internship', 'Placement', 'Graduate');

-- AlterTable
ALTER TABLE "Opportunity" DROP COLUMN "type",
ADD COLUMN     "type" "OpportunityType" NOT NULL;

-- AlterTable
ALTER TABLE "StudentProfile" DROP COLUMN "lookingFor",
ADD COLUMN     "lookingFor" "OpportunityType";
