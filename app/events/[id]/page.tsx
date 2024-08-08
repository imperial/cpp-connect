import prisma from "@/lib/db"

import styles from "./page.module.scss"

import { Box, Card, Flex, Heading, Inset, Separator, Text } from "@radix-ui/themes"
import { format, formatDistanceStrict, isSameDay } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import React from "react"
import { BsBoxArrowUpRight, BsCalendar, BsGlobe, BsPinMap } from "react-icons/bs"
import Markdown from "react-markdown"

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
 *       <b>Sat, 01 Jan 12:00</b>-<b>14:00</b> GMT+0 (2 hours)
 *     </>
 * @example
 *   formatEventDateTime(
 *     new Date("2022-01-01T12:00:00Z"),
 *     new Date("2022-01-02T14:00:00Z")
 *   ) =>
 *   <>
 *     <b>Sat, 01 Jan 12:00</b> to <b>Sun, 02 Jan 14:00</b> GMT+0 (1 day)
 *   </>
 */
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

const EventPage = async ({ params }: { params: { id: string } }) => {
  const event = await prisma.event.findUnique({ where: { id: parseInt(params.id) }, include: { company: true } })
  if (!event) {
    notFound()
  }

  const companyBanner = (
    await prisma.companyProfile.findUnique({
      where: { id: event.companyID },
      select: { banner: true },
    })
  )?.banner

  return (
    <Flex gap="3" direction="column">
      <Card className={styles.headerCard}>
        <Inset clip="padding-box" p="0" side="top">
          <Image
            src={companyBanner ?? ""}
            alt={`${event.company.name} banner`}
            width={0}
            height={0}
            className={styles.banner}
          />
        </Inset>

        <Flex wrap="wrap">
          <Flex direction="column" gap="4" p="5" className={styles.mainContent}>
            <Text color="gray" size="2">
              {format(event.dateStart, "E dd/MM")}
            </Text>
            <Box>
              <Heading size="8">{event.title}</Heading>
              <Text color="gray">
                By <Link href={`/companies/${encodeURIComponent(event.company.name)}`}>{event.company.name}</Link>
              </Text>
            </Box>
            <Text>{event.shortDescription}</Text>
          </Flex>

          <Separator orientation="vertical" className={styles.Separator} />

          <Flex direction="column" justify="center" gap="4" p="5">
            <Heading>Sign Up</Heading>

            <Flex align="center" gap="2">
              <BsGlobe />
              <Link href={event.link} target="_blank">
                {event.link}
              </Link>
            </Flex>

            <Text color="gray" size="2">
              ({event.spaces} spaces)
            </Text>
          </Flex>
        </Flex>
      </Card>

      <Card>
        <Heading>Date & Time</Heading>

        <Flex align="center" gap="2">
          <BsCalendar />
          <Text>{formatEventDateTime(event.dateStart, event.dateEnd)}</Text>
        </Flex>

        <Heading>Location</Heading>

        <Flex align="center" gap="2">
          <BsPinMap />
          <Text>{event.location}</Text>
        </Flex>

        <Link href={`https://www.google.com/maps/search/${encodeURIComponent(event.location)}`} target="_blank">
          <Flex align="center" gap="2">
            <Text>Search in Google Maps</Text>
            <BsBoxArrowUpRight />
          </Flex>
        </Link>

        <Heading>About</Heading>

        <Markdown>{event.richSummary}</Markdown>
      </Card>
    </Flex>
  )
}

export default EventPage
