import RestrictedArea from "@/components/rbac/RestrictedArea"
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
    <RestrictedArea allowedRoles={["STUDENT"]}>
      <EventTable events={events} />
    </RestrictedArea>
  )
}

export default EventsPage
