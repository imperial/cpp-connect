import CompaniesTable from "@/app/companies/CompaniesTable"
import RestrictedArea from "@/components/rbac/RestrictedArea"
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
      size: true,
      hq: true,
      slug: true,
    },
  })

  return (
    <RestrictedArea allowedRoles={["STUDENT"]}>
      <Flex gap="5" direction="column">
        <CompanyAdminActions />
        <CompaniesTable companies={companies} />
      </Flex>
    </RestrictedArea>
  )
}

export default OpportunitiesPage
