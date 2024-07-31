import ListingTable from "@/components/Table"
import prisma from "@/lib/db"

import React from "react"

const OpportunitiesPage = async () => {
  const opportunities = await prisma.opportunity.findMany({
    include: {
      company: true,
    },
  })

  return (
    <div>
      <ListingTable opportunities={opportunities} />
    </div>
  )
}

export default OpportunitiesPage
