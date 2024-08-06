import CompaniesTable from "@/app/companies/CompaniesTable"
import StudentOnlyArea from "@/components/rbac/StudentOnlyArea"
import prisma from "@/lib/db"

import { CompanyAdminActions } from "./CompanyAdminActions"

import { Flex } from "@radix-ui/themes"
import React from "react"

const OpportunitiesPage = async () => {
  const companies = await prisma.companyProfile.findMany({
    select: {
      logo: true,
      name: true,
      sector: true,
      website: true,
      size: true,
      hq: true,
    },
  })

  return (
    <StudentOnlyArea>
      <Flex gap="5" direction="column">
        <CompanyAdminActions />
        <CompaniesTable companies={companies} />
      </Flex>
    </StudentOnlyArea>
  )
}

export default OpportunitiesPage
