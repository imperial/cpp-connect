import StudentOnlyArea from "@/components/rbac/StudentOnlyArea"
import prisma from "@/lib/db"

import EventTable from "./EventTable"

import React from "react"

const EventsPage = async () => {
  const events = await prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      company: true,
    },
  })

  return (
    <StudentOnlyArea>
      <div>
        <EventTable events={events} />
      </div>
    </StudentOnlyArea>
  )
}

export default EventsPage
