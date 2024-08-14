import OpportunityTable from "@/app/opportunities/OpportunityTable"
import RestrictedArea from "@/components/rbac/RestrictedArea"
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
    <RestrictedArea allowedRoles={["STUDENT"]}>
      <OpportunityTable
        opportunities={opportunities}
        columns={["company.name", "position", "location", "type", "createdAt"]}
      />
    </RestrictedArea>
  )
}

export default OpportunitiesPage
