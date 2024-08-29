import { getCompanyLink } from "@/app/companies/getCompanyLink"
import { auth } from "@/auth"
import { DeleteEvent } from "@/components/DeleteEvent"
import { FileViewer } from "@/components/FileViewer"
import Link from "@/components/Link"
import MdViewer from "@/components/MdViewer"
import { EditEvent } from "@/components/UpsertEvent"
import RestrictedAreaCompany from "@/components/rbac/RestrictedAreaCompany"
import prisma from "@/lib/db"

import FormattedClientDateTime from "./FormattedClientDateTime"
import styles from "./page.module.scss"

import { Role } from "@prisma/client"
import { Box, Button, Card, Flex, Heading, Inset, Separator, Text } from "@radix-ui/themes"
import { format } from "date-fns"
import Image from "next/image"
import { notFound } from "next/navigation"
import React from "react"
import { BsBoxArrowUpRight, BsFileRichtext, BsPinMap } from "react-icons/bs"

const EventPage = async ({ params }: { params: { id: string } }) => {
  const session = await auth()
  const id = parseInt(params.id, 10)

  if (isNaN(id) || id.toString() !== params.id) {
    notFound()
  }

  const event = await prisma.event.findUnique({ where: { id }, include: { company: true } })
  if (!event) {
    notFound()
  }

  return (
    <Flex gap="3" direction="column">
      <Card className={styles.headerCard}>
        <Inset clip="padding-box" p="0" side="top">
          <Image
            unoptimized
            src={
              event.company.banner ? `/api/uploads/${event.company.banner}` : "https://picsum.photos/1200/300?grayscale"
            }
            alt={`${event.company.name} banner`}
            width={0}
            height={0}
            className={styles.banner}
          />
        </Inset>

        <Flex wrap="wrap">
          <Flex direction="column" gap="4" p="5" className={styles.mainContent}>
            <Flex justify="between">
              <Box>
                <Text color="gray" size="2">
                  {format(event.dateStart, "E dd/MM")}
                </Text>
                <Heading size="8">{event.title}</Heading>
                <Box>
                  <Text color="gray">By</Text> <Link href={getCompanyLink(event.company)}>{event.company.name}</Link>
                </Box>
              </Box>
              <RestrictedAreaCompany companyId={event.companyID} showMessage={false}>
                <Flex gap="2">
                  <EditEvent prevEvent={event} companyID={event.companyID} />
                  <DeleteEvent id={event.id} companyID={event.companyID} redirectOnDelete />
                </Flex>
              </RestrictedAreaCompany>
            </Flex>
            <Text>{event.shortDescription}</Text>
          </Flex>
          {session?.user.role === Role.STUDENT && (
            <>
              <Separator orientation="vertical" className={styles.Separator} />
              <Flex direction="column" justify="center" align="center" gap="4" p="5">
                <Heading>Sign Up</Heading>

                <Button size="3" className={styles.signupButton} asChild>
                  <Link href={event.link} target="_blank">
                    Register for this event
                  </Link>
                </Button>
                <Text color="gray" size="2">
                  ({event.spaces} spaces)
                </Text>
              </Flex>
            </>
          )}
        </Flex>
      </Card>

      <Card className={styles.aboutCard}>
        {event.attachment && (
          <Flex gap="2" direction="column">
            <Heading>Attachment</Heading>

            <FileViewer fileUrl={`/api/uploads/${event.attachment}`} title={`${event.title} attachment`}>
              <Flex align="center" gap="2" asChild width="fit-content">
                <Link href="">
                  <BsFileRichtext />
                  View details
                </Link>
              </Flex>
            </FileViewer>
          </Flex>
        )}

        <Flex gap="2" direction="column">
          <Heading>Date & Time</Heading>

          <Flex align="center" gap="2">
            <FormattedClientDateTime dateStart={event.dateStart} dateEnd={event.dateEnd} />
          </Flex>
        </Flex>

        <Flex gap="2" direction="column">
          <Heading>Location</Heading>

          <Flex align="center" gap="2">
            <BsPinMap />
            <Text>{event.location}</Text>
          </Flex>

          <Link
            href={`https://www.google.com/maps/search/${encodeURIComponent(event.location)}`}
            target="_blank"
            className={styles.mapsLink}
          >
            <Flex align="center" gap="2">
              <Text size="2">Search in Google Maps</Text>
              <BsBoxArrowUpRight />
            </Flex>
          </Link>
        </Flex>

        <Flex gap="2" direction="column">
          <Heading>About</Heading>
          <MdViewer markdown={event.richSummary} />
        </Flex>
      </Card>
    </Flex>
  )
}

export default EventPage
