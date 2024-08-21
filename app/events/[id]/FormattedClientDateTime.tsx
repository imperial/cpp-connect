"use client"

import { Flex, Spinner, Text } from "@radix-ui/themes"
import { format, formatDistanceStrict, isSameDay } from "date-fns"
import React, { useEffect, useState } from "react"
import { BsCalendar } from "react-icons/bs"

const formatEventDateTime = (dateStart: Date, dateEnd: Date | null) => {
  const formattedStart = <b>{format(dateStart, "E, dd MMM kk:mm")}</b>
  const formattedEnd = dateEnd ? (
    isSameDay(dateStart, dateEnd) ? (
      <>
        -<b>{format(dateEnd, "kk:mm")}</b>
      </>
    ) : (
      <>
        {" "}
        to <b>{format(dateEnd, "E, dd MMM kk:mm")}</b>
      </>
    )
  ) : (
    ""
  )
  const timezone = format(dateStart, "O")
  const formattedDuration = dateEnd ? <>{formatDistanceStrict(dateStart, dateEnd)}</> : ""

  return (
    <>
      {formattedStart}
      {formattedEnd} {timezone} ({formattedDuration})
    </>
  )
}

const FormattedClientDateTime = ({ dateStart, dateEnd }: { dateStart: Date; dateEnd: Date | null }) => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <Flex direction="row" gap="3">
        <Spinner />
        Loading
      </Flex>
    )
  }
  return (
    <Flex align="center" gap="2">
      <BsCalendar />
      <Text>{formatEventDateTime(dateStart, dateEnd)}</Text>
    </Flex>
  )
}

export default FormattedClientDateTime
