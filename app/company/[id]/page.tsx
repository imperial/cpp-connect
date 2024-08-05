import prisma from "@/lib/db"

import styles from "./page.module.scss"

import * as Collapsible from "@radix-ui/react-collapsible"
import { Box, Card, Flex, Heading, Inset, Link, Text } from "@radix-ui/themes"
import Image from "next/image"
import { notFound } from "next/navigation"
import React from "react"
import Markdown from "react-markdown"

const CompanyPage = async ({ params }: { params: { id: string } }) => {
  const companyProfile = await prisma.companyProfile.findUnique({ where: { id: parseInt(params.id) } })

  if (!companyProfile) {
    notFound()
  }

  return (
    <Flex gap="3" direction="column">
      <Card className={styles.headerCard}>
        <Inset clip="padding-box" p="0" side="top">
          <Image src="/images/amazon-logo.svg" alt={"amazon"} width={0} height={0} className={styles.banner} />
        </Inset>

        <Flex direction="column">
          <Flex gap="5" direction="column" className={styles.companyInfo} p="4" pt="0">
            <Box className={styles.companyLogoContainer}>
              <Card className={styles.companyLogo}>
                <Image src="/images/amazon-logo.svg" alt={"amazon"} width={0} height={0} />
              </Card>
            </Box>

            <Heading color="blue" size="7">
              {companyProfile.name}
            </Heading>

            <Text>
              {[companyProfile.sector, companyProfile.hq, companyProfile.size && `${companyProfile.size} employees`]
                .filter(x => x)
                .join(" • ")}
            </Text>
          </Flex>
        </Flex>
      </Card>
      <Card className={styles.aboutCard}>
        <Collapsible.Root className={styles.CollapsibleRoot}>
          <Heading size="6">About</Heading>
          <Box className={styles.summaryContainer}>
            <Markdown className={styles.markdownContainer}>{companyProfile.summary}</Markdown>

            <Heading size="4" as="h2" mt="4">
              Website
            </Heading>
            <Link href={companyProfile.website} target="_blank">
              {companyProfile.website}
            </Link>

            <Heading size="4" as="h2" mt="4">
              Sector
            </Heading>
            {companyProfile.sector}

            {companyProfile.hq && (
              <>
                <Heading size="4" as="h2" mt="4">
                  Headquarters
                </Heading>
                {companyProfile.hq}
              </>
            )}

            {companyProfile.founded && (
              <>
                <Heading size="4" as="h2" mt="4">
                  Founded
                </Heading>
                {companyProfile.founded}
              </>
            )}

            {companyProfile.size && (
              <>
                <Heading size="4" as="h2" mt="4">
                  Size
                </Heading>
                {companyProfile.size}
              </>
            )}
          </Box>
          <Collapsible.Trigger className={styles.CollapsibleTrigger} asChild>
            <Text size="2">Read more...</Text>
          </Collapsible.Trigger>
        </Collapsible.Root>
      </Card>
    </Flex>
  )
}

export default CompanyPage
