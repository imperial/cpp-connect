-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_companyID_fkey";

-- DropForeignKey
ALTER TABLE "Opportunity" DROP CONSTRAINT "Opportunity_companyID_fkey";

-- AddForeignKey
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_companyID_fkey" FOREIGN KEY ("companyID") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
