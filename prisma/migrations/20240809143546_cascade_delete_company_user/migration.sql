-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_associatedCompanyId_fkey";

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_associatedCompanyId_fkey" FOREIGN KEY ("associatedCompanyId") REFERENCES "CompanyProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
