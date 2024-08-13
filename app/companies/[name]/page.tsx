import EventTable from "@/app/events/EventTable"
import OpportunityTable from "@/app/opportunities/OpportunityTable"
import { EditCompany } from "@/components/EditCompany"
import Link from "@/components/Link"
import prisma from "@/lib/db"

import { CompanyManagement } from "./CompanyManagement"
import styles from "./page.module.scss"

import * as Collapsible from "@radix-ui/react-collapsible"
import { Box, Card, Flex, Heading, Inset, Tabs, Text } from "@radix-ui/themes"
import Image from "next/image"
import { notFound } from "next/navigation"
import React from "react"
import { BsEnvelope, BsGlobe, BsTelephone } from "react-icons/bs"
import Markdown from "react-markdown"

/**
 * Conditional rendering of company detail. Will only render if children are truthy.
 * @param title The title of the company detail.
 * @param children The company detail provided.
 */
const CompanyDetail = ({ title, children }: { title: string; children: React.ReactNode }) => {
  if (children) {
    return (
      <>
        <Heading size="4" as="h2" mt="4">
          {title}
        </Heading>
        {children}
      </>
    )
  } else {
    return null
  }
}

const CompanyPage = async ({ params }: { params: { name: string } }) => {
  const companyProfile = await prisma.companyProfile.findFirst({
    where: {
      name: decodeURIComponent(params.name),
    },
    include: {
      opportunities: {
        orderBy: { createdAt: "desc" },
        include: {
          company: true,
        },
      },
      events: {
        orderBy: { createdAt: "desc" },
        include: {
          company: true,
        },
      },
      companyUsers: {
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      },
    },
  })

  if (!companyProfile) {
    notFound()
  }

  return (
    <Flex gap="3" direction="column">
      <Card className={styles.headerCard}>
        <Inset clip="padding-box" p="0" side="top">
          <Image
            src={companyProfile.banner}
            alt={`${companyProfile.name} banner`}
            width={0}
            height={0}
            className={styles.banner}
          />
        </Inset>

        <Flex direction="column">
          <Flex gap="3" direction="column" className={styles.companyInfo} p="4" pt="0">
            <Flex className={styles.companyLogoContainer} justify="between">
              <Card className={styles.companyLogo}>
                <Image src={companyProfile.logo} alt={`${companyProfile.name} logo`} width={0} height={0} />
              </Card>
              <EditCompany prevCompanyProfile={companyProfile} />
            </Flex>

            <Heading color="blue" size="7" mt="4">
              {companyProfile.name}
            </Heading>

            <Text>
              {[companyProfile.sector, companyProfile.hq, companyProfile.size && `${companyProfile.size} employees`]
                .filter(x => x)
                .join(" • ")}
            </Text>

            <Flex align="center" gap="2">
              <BsGlobe />
              <Link href={companyProfile.website} target="_blank" className={styles.contactLink}>
                {companyProfile.website}
              </Link>
            </Flex>

            {companyProfile.email && (
              <Flex align="center" gap="2">
                <BsEnvelope />
                <Link href={`mailto:${companyProfile.email}`} className={styles.contactLink}>
                  {companyProfile.email}
                </Link>
              </Flex>
            )}

            {companyProfile.phone && (
              <Flex align="center" gap="2">
                <BsTelephone />
                <Text>{companyProfile.phone}</Text>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Card>

      <Card>
        <Tabs.Root defaultValue="about">
          <Tabs.List>
            <Tabs.Trigger value="about">About</Tabs.Trigger>
            <Tabs.Trigger value="opportunities">Opportunities</Tabs.Trigger>
            <Tabs.Trigger value="events">Events</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="about">
            <Box className={styles.aboutCard}>
              <Collapsible.Root className={styles.CollapsibleRoot}>
                <Box className={styles.summaryContainer}>
                  <CompanyDetail title="Summary">
                    <Markdown className={styles.markdownContainer}>{companyProfile.summary}</Markdown>
                  </CompanyDetail>

                  <CompanyDetail title="Website">
                    <Link href={companyProfile.website} target="_blank">
                      {companyProfile.website}
                    </Link>
                  </CompanyDetail>

                  <CompanyDetail title="Sector">{companyProfile.sector}</CompanyDetail>

                  <CompanyDetail title="Headquarters">{companyProfile.hq}</CompanyDetail>

                  <CompanyDetail title="Founded">{companyProfile.founded}</CompanyDetail>

                  <CompanyDetail title="Size">{companyProfile.size}</CompanyDetail>
                </Box>
                <Collapsible.Trigger className={styles.CollapsibleTrigger} asChild>
                  <Text size="2">Read more...</Text>
                </Collapsible.Trigger>
              </Collapsible.Root>
            </Box>
          </Tabs.Content>
          <Tabs.Content value="opportunities">
            <Box p="8">
              <OpportunityTable
                opportunities={companyProfile.opportunities}
                keptColumns={["position", "location", "type", "createdAt"]}
              />
            </Box>
          </Tabs.Content>
          <Tabs.Content value="events">
            <Box p="8">
              <EventTable
                events={companyProfile.events}
                columns={["title", "dateStart", "shortDescription", "location", "spaces"]}
                nonFilterable={["company.name"]}
              />
            </Box>
          </Tabs.Content>
        </Tabs.Root>
      </Card>

      <CompanyManagement company={companyProfile} />
    </Flex>
  )
}

export default CompanyPage
