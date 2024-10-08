import { getCompanyLink } from "@/app/companies/getCompanyLink"
import Chip from "@/components/Chip"
import { DeleteOpportunity } from "@/components/DeleteOpportunity"
import Link from "@/components/Link"
import MdViewer from "@/components/MdViewer"
import { EditOpportunity } from "@/components/UpsertOpportunity"
import RestrictedAreaCompany from "@/components/rbac/RestrictedAreaCompany"
import prisma from "@/lib/db"

import ClientDeadline from "./ClientDeadline"
import styles from "./page.module.scss"

import { Box, Button, Card, Flex, Grid, Heading, Inset, Text } from "@radix-ui/themes"
import { format } from "date-fns"
import Image from "next/image"
import { notFound } from "next/navigation"
import React from "react"
import { BsBoxArrowUpRight, BsBriefcase, BsCalendar, BsCheckCircle, BsClock, BsPinMap, BsXCircle } from "react-icons/bs"

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
            unoptimized
            src={
              opportunity.company.banner
                ? `/api/uploads/${opportunity.company.banner}`
                : "https://picsum.photos/1200/300?grayscale"
            }
            alt={`${opportunity.company.name} banner`}
            width={0}
            height={0}
            className={styles.banner}
          />
        </Inset>
        <Flex wrap="wrap" direction="column" p="5" gap="5">
          <Flex justify="between">
            <Box>
              <Heading size="8">{opportunity.position}</Heading>

              <Box>
                At <Link href={getCompanyLink(opportunity.company)}>{opportunity.company.name}</Link>
              </Box>
            </Box>
            <RestrictedAreaCompany companyId={opportunity.companyID} showMessage={false}>
              <Flex gap="2">
                <EditOpportunity prevOpportunity={opportunity} companyID={opportunity.companyID} />
                <DeleteOpportunity id={opportunity.id} companyID={opportunity.companyID} redirectOnDelete />
              </Flex>
            </RestrictedAreaCompany>
          </Flex>

          <Flex gap="1" wrap="wrap">
            <Chip label={opportunity.location} />
            <Chip label={opportunity.type} />
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
            <MdViewer markdown={opportunity.description} />
          </Flex>

          <Flex direction="column" gap="2">
            <Heading>Opportunity Details</Heading>

            <Grid columns="min-content auto auto" gap="2" align="center" className={styles.opportunityDetails}>
              <BsPinMap />
              <Text>Location</Text>
              <Text>{opportunity.location}</Text>

              <BsBriefcase />
              <Text>Opportunity type</Text>
              <Text>{opportunity.type}</Text>

              {opportunity.deadline && (
                <>
                  <BsClock />
                  <Text>Deadline</Text>
                  <ClientDeadline date={opportunity.deadline} />
                </>
              )}

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
