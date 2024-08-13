import { CompanyProfile } from "@prisma/client"

export const getCompanyLink = (company: Pick<CompanyProfile, "slug">) => `/companies/${company.slug}`
