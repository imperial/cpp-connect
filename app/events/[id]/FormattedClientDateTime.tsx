"use client"

import { Flex, Spinner, Text } from "@radix-ui/themes"
import { format, formatDistanceStrict, isSameDay } from "date-fns"
import React, { useEffect, useState } from "react"
import { BsCalendar } from "react-icons/bs"

/**
 * Format an event's date to JSX
 * @param dateStart The start date time
 * @param dateEnd The end date time
 * @example
 *   formatEventDateTime(
 *     new Date("2022-01-01T12:00:00Z"),
 *     new Date("2022-01-01T14:00:00Z")
 *   ) =>
 *     <>
 *       <b><time>Sat, 01 Jan 12:00</time></b>-<b><time>14:00</time></b> GMT+0 (2 hours)
 *     </>
 * @example
 *   formatEventDateTime(
 *     new Date("2022-01-01T12:00:00Z"),
 *     new Date("2022-01-02T14:00:00Z")
 *   ) =>
 *   <>
 *     <b><time>Sat, 01 Jan 12:00</time></b> to <b><time>Sun, 02 Jan 14:00</time></b> GMT+0 (1 day)
 *   </>
 */
const formatEventDateTime = (dateStart: Date, dateEnd: Date | null) => {
  const formattedStart = (
    <b>
      <time>{format(dateStart, "E, dd MMM HH:mm")}</time>
    </b>
  )
  const formattedEnd = dateEnd ? (
    isSameDay(dateStart, dateEnd) ? (
      <>
        -
        <b>
          <time>{format(dateEnd, "HH:mm")}</time>
        </b>
      </>
    ) : (
      <>
        {" "}
        to{" "}
        <b>
          <time>{format(dateEnd, "E, dd MMM HH:mm")}</time>
        </b>
      </>
    )
  ) : (
    ""
  )
  const timezone = format(dateStart, "O")
  const formattedDuration = dateEnd ? <>({formatDistanceStrict(dateStart, dateEnd)})</> : ""

  return (
    <>
      {formattedStart}
      {formattedEnd} {timezone} {formattedDuration}
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
      <Flex direction="row" gap="3" align="center">
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
