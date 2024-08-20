import EventTable from "@/app/events/EventTable"
import OpportunityTable from "@/app/opportunities/OpportunityTable"
import { auth } from "@/auth"
import { EditCompany } from "@/components/EditCompany"
import Link from "@/components/Link"
import MdViewer from "@/components/MdViewer"
import { AddEvent } from "@/components/UpsertEvent"
import { AddOpportunity } from "@/components/UpsertOpportunity"
import RestrictedAreaCompany, { checkCompany } from "@/components/rbac/RestrictedAreaCompany"
import prisma from "@/lib/db"

import { CompanyManagement } from "./CompanyManagement"
import styles from "./page.module.scss"

import { Role } from "@prisma/client"
import * as Collapsible from "@radix-ui/react-collapsible"
import { Box, Card, Flex, Heading, Inset, Tabs, Text } from "@radix-ui/themes"
import Image from "next/image"
import { notFound } from "next/navigation"
import React from "react"
import { BsBuildings, BsEnvelope, BsGlobe, BsTelephone } from "react-icons/bs"

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

const CompanyPage = async ({ params }: { params: { slug: string } }) => {
  const session = await auth()
  const companyProfile = await prisma.companyProfile.findFirst({
    where: {
      slug: decodeURIComponent(params.slug),
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
            unoptimized
            src={
              companyProfile.banner
                ? `/api/uploads/${companyProfile.banner}`
                : "https://picsum.photos/1200/300?grayscale"
            }
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
                {companyProfile.logo ? (
                  <Image
                    unoptimized
                    src={companyProfile.logo ? `/api/uploads/${companyProfile.logo}` : ""}
                    alt={`${companyProfile.name} logo`}
                    width={0}
                    height={0}
                  />
                ) : (
                  <BsBuildings size="80%" />
                )}
              </Card>
              <RestrictedAreaCompany companyId={companyProfile.id} showMessage={false}>
                <EditCompany prevCompanyProfile={companyProfile} />
              </RestrictedAreaCompany>
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
          <Tabs.List highContrast>
            <Tabs.Trigger value="about">About</Tabs.Trigger>
            <Tabs.Trigger value="opportunities">Opportunities</Tabs.Trigger>
            <Tabs.Trigger value="events">Events</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="about">
            <Box className={styles.aboutCard}>
              <Collapsible.Root className={styles.CollapsibleRoot} defaultOpen={session?.user.role === "STUDENT"}>
                <Box className={styles.summaryContainer}>
                  <CompanyDetail title="Summary">
                    {companyProfile.summary && <MdViewer markdown={companyProfile.summary} />}
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
            <RestrictedAreaCompany companyId={companyProfile.id} showMessage={false}>
              <Card variant="surface" className={styles.opportunityPanel}>
                <Flex gap="3" direction="row" align="center" justify="between" p="2">
                  <Heading size="6">Opportunities panel</Heading>
                  <Flex gap="3" direction="row" align="center">
                    <AddOpportunity companyID={companyProfile.id} />
                  </Flex>
                </Flex>
              </Card>
            </RestrictedAreaCompany>

            <Box p="8">
              <OpportunityTable
                opportunities={companyProfile.opportunities}
                columns={["position", "location", "type", "createdAt"]}
                displayColumns={
                  !!session && (session.user.role === Role.ADMIN || (await checkCompany(companyProfile.id)(session)))
                    ? ["adminButtons"]
                    : []
                }
              />
            </Box>
          </Tabs.Content>
          <Tabs.Content value="events">
            <RestrictedAreaCompany companyId={companyProfile.id} showMessage={false}>
              <Card variant="surface" className={styles.opportunityPanel}>
                <Flex gap="3" direction="row" align="center" justify="between" p="2">
                  <Heading size="6">Events panel</Heading>
                  <Flex gap="3" direction="row" align="center">
                    <AddEvent companyID={companyProfile.id} />
                  </Flex>
                </Flex>
              </Card>
            </RestrictedAreaCompany>
            <Box p="8">
              <EventTable
                events={companyProfile.events}
                columns={["title", "dateStart", "shortDescription", "location", "spaces"]}
                displayColumns={
                  !!session && (session.user.role === Role.ADMIN || (await checkCompany(companyProfile.id)(session)))
                    ? ["adminButtons"]
                    : []
                }
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
