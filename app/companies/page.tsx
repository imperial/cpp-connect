import CompaniesTable from "@/app/companies/CompaniesTable"
import StudentOnlyArea from "@/components/rbac/StudentOnlyArea"
import prisma from "@/lib/db"

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
      <CompaniesTable companies={companies} />
    </StudentOnlyArea>
  )
}

export default OpportunitiesPage
