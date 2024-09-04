import OpportunityTable from "@/app/opportunities/OpportunityTable"
import RestrictedArea from "@/components/rbac/RestrictedArea"
import prisma from "@/lib/db"

import { Flex, Heading } from "@radix-ui/themes"
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
      <Flex direction="column" gap="5" align="center" width="100%">
        <Heading size="8">Opportunities</Heading>
        <OpportunityTable
          opportunities={opportunities}
          initialColumns={["company.name", "position", "location", "type", "createdAt", "deadline"]}
        />
      </Flex>
    </RestrictedArea>
  )
}

export const dynamic = "force-dynamic"
export default OpportunitiesPage
