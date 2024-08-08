-- AlterTable
ALTER TABLE "User" ADD COLUMN     "associatedCompanyId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_associatedCompanyId_fkey" FOREIGN KEY ("associatedCompanyId") REFERENCES "CompanyProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Add a check constraint to User:
-- User.associtedCompanyId must be specified if role is "COMPANY"
-- It must not be specified in all other cases

ALTER TABLE "User" ADD CONSTRAINT "User_associatedCompanyId_check" CHECK (
	("role" = 'COMPANY' AND "associatedCompanyId" IS NOT NULL) OR
	("role" != 'COMPANY' AND "associatedCompanyId" IS NULL)
);
