"use client"

import { Flex, Spinner, Text } from "@radix-ui/themes"
import { format } from "date-fns"
import React, { useEffect, useState } from "react"

const ClientDeadline = ({ date }: { date: Date }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Flex direction="row" gap="3" align="center">
        <Spinner />
        Loading
      </Flex>
    )
  }
  return <Text>{format(date, "dd/MM/yyyy HH:mm O")}</Text>
}

export default ClientDeadline
