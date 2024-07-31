import prisma from '@/lib/db'
import React from 'react'

const OpportunitiesPage = async () => {
  const opportunities = await prisma.opportunity.findMany({
    include: {
      company: true,
    },
  })
  
  return (
    <div>
        {opportunities.map((opportunity, index) => (
            <p key={index}>{opportunity.company.id}</p>
        ))}
    </div>
  )
}

export default OpportunitiesPage