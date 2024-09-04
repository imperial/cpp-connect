import CompanyTable from "@/app/companies/CompanyTable"
import RestrictedArea from "@/components/rbac/RestrictedArea"
import prisma from "@/lib/db"

import { CompanyAdminActions } from "./CompanyAdminActions"

import { Flex, Heading } from "@radix-ui/themes"
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
      <Flex gap="5" direction="column" align="center">
        <Heading size="8">Companies</Heading>
        <CompanyAdminActions />
        <CompanyTable initialColumns={["name", "sector", "size", "hq"]} companies={companies} />
      </Flex>
    </RestrictedArea>
  )
}

export const dynamic = "force-dynamic"
export default OpportunitiesPage
