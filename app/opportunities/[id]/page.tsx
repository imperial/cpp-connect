import Chip from "@/components/Chip"
import prisma from "@/lib/db"

import styles from "./page.module.scss"

import { Box, Button, Card, Flex, Grid, Heading, Inset, Text } from "@radix-ui/themes"
import { format } from "date-fns"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import React from "react"
import { BsBoxArrowUpRight, BsBriefcase, BsCalendar, BsCheckCircle, BsPinMap, BsXCircle } from "react-icons/bs"
import Markdown from "react-markdown"

const OpportunityPage = async ({ params }: { params: { id: string } }) => {
  const id = parseInt(params.id, 10)

  if (isNaN(id) || id.toString() !== params.id) {
    notFound()
  }

  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: { company: true },
  })
  if (!opportunity) {
    notFound()
  }

  return (
    <Flex gap="3" direction="column">
      <Card className={styles.headerCard}>
        <Inset clip="padding-box" p="0" side="top">
          <Image
            src={opportunity.company.banner}
            alt={`${opportunity.company.name} banner`}
            width={0}
            height={0}
            className={styles.banner}
          />
        </Inset>

        <Flex justify="between" align="end" p="5" gap="5" wrap="wrap">
          <Flex wrap="wrap" direction="column" gap="5">
            <Box>
              <Heading size="8">{opportunity.position}</Heading>

              <Box>
                At{" "}
                <Link href={`/companies/${encodeURIComponent(opportunity.company.name)}`}>
                  {opportunity.company.name}
                </Link>
              </Box>
            </Box>

            <Flex gap="1" wrap="wrap">
              <Chip label={opportunity.location} />
              <Chip label={opportunity.type} />
            </Flex>
          </Flex>
          {opportunity.available ? (
            <Button asChild size="4" className={styles.applyButton}>
              <Link href={opportunity.link} target="_blank">
                Apply Now
                <BsBoxArrowUpRight />
              </Link>
            </Button>
          ) : (
            <Text color="red" size="5">
              Unavailable
            </Text>
          )}
        </Flex>
      </Card>

      <Card className={styles.aboutCard}>
        <Flex direction="column" gap="3">
          <Flex direction="column" gap="2">
            <Heading>Full Opportunity Description</Heading>
            <Markdown>{opportunity.description}</Markdown>
          </Flex>

          <Flex direction="column" gap="2">
            <Heading>Opportunity Details</Heading>

            <Grid
              // display="inline-grid"
              columns="min-content auto auto"
              gap="2"
              align="center"
              className={styles.opportunityDetails}
            >
              <BsPinMap />
              <Text>Location</Text>
              <Text>{opportunity.location}</Text>

              <BsBriefcase />
              <Text>Opportunity type</Text>
              <Text>{opportunity.type}</Text>

              {opportunity.available ? (
                <>
                  <BsCheckCircle />
                  <Text>Availability</Text>
                  <Text>Available</Text>
                </>
              ) : (
                <>
                  <BsXCircle />
                  <Text>Availability</Text>
                  <Text>Unavailable</Text>
                </>
              )}

              <BsCalendar />
              <Text>Added</Text>
              <Text>{format(opportunity.createdAt, "dd/MM/yy")}</Text>
            </Grid>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  )
}

export default OpportunityPage
