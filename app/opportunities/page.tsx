import OpportunityTable from "@/app/opportunities/OpportunityTable"
import StudentOnlyArea from "@/components/rbac/StudentOnlyArea"
import prisma from "@/lib/db"

import React from "react"

const OpportunitiesPage = async () => {
  const opportunities = await prisma.opportunity.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      company: true,
    },
  })

  return (
    <StudentOnlyArea>
      <OpportunityTable opportunities={opportunities} />
    </StudentOnlyArea>
  )
}

export default OpportunitiesPage
