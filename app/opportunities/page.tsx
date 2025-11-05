import OpportunityTable from "@/app/opportunities/OpportunityTable"
import { auth } from "@/auth"
import RestrictedArea from "@/components/rbac/RestrictedArea"
import { isPlacementStudent } from "@/lib/abcApi"
import prisma from "@/lib/db"

import { OpportunityType, Role } from "@prisma/client"
import { Flex, Heading, Text } from "@radix-ui/themes"
import React from "react"

const OpportunitiesPage = async () => {
  let opportunities = await prisma.opportunity.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      company: true,
    },
  })

  const session = await auth()
  if (!session) return <Text>Not authenticated</Text>

  if (session.user.role === Role.STUDENT) {
    const isPlacement = await isPlacementStudent(session.user.email)
    if (!isPlacement) opportunities = opportunities.filter(o => o.type !== OpportunityType.Placement)
  }

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
