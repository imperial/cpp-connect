import CompaniesTable from "@/app/companies/CompaniesTable"
import StudentOnlyArea from "@/components/rbac/StudentOnlyArea"
import prisma from "@/lib/db"

import React from "react"

const OpportunitiesPage = async () => {
  const companies = await prisma.companyProfile.findMany()

  return (
    <StudentOnlyArea>
      <CompaniesTable companies={companies} />
    </StudentOnlyArea>
  )
}

export default OpportunitiesPage
