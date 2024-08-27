import RestrictedArea from "@/components/rbac/RestrictedArea"
import prisma from "@/lib/db"

import EventTable from "./EventTable"

import { Flex, Heading } from "@radix-ui/themes"
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
      <Flex direction="column" gap="5" align="center" width="100%">
        <Heading size="8">Events</Heading>
        <EventTable
          events={events}
          initialColumns={["company.name", "title", "dateStart", "shortDescription", "location", "spaces"]}
        />
      </Flex>
    </RestrictedArea>
  )
}

export default EventsPage
