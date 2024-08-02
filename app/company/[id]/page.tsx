import prisma from "@/lib/db"

import styles from "./page.module.scss"

import * as Collapsible from "@radix-ui/react-collapsible"
import { Box, Card, Flex, Heading, Inset, Text } from "@radix-ui/themes"
import Image from "next/image"
import { notFound } from "next/navigation"
import React from "react"

const CompanyPage = async ({ params }: { params: { id: string } }) => {
  const companyProfile = await prisma.companyProfile.findUnique({ where: { id: parseInt(params.id) } })

  if (!companyProfile) {
    notFound()
  }

  return (
    <Flex gap="1" direction="column">
      <Card className={styles.headerCard}>
        <Inset clip="padding-box" p="0" side="top" pb="current">
          <Image src="/images/amazon-logo.svg" alt={"amazon"} width={0} height={0} className={styles.banner} />
        </Inset>
        <Flex direction="column">
          <Flex gap="5" direction="column" className={styles.companyInfo}>
            <Box className={styles.companyLogoContainer}>
              <Card className={styles.companyLogo}>
                <Image src="/images/amazon-logo.svg" alt={"amazon"} width={0} height={0} />
              </Card>
            </Box>
            <Heading color="blue" size="7">
              {companyProfile.name}
            </Heading>
            <Text size="5">{companyProfile.sector}</Text>
            <Text>{[companyProfile.hq, companyProfile.founded, companyProfile.size].filter(x => x).join(" • ")}</Text>
          </Flex>
        </Flex>
      </Card>
      <Card>
        <Collapsible.Root className={styles.CollapsibleRoot}>
          <Collapsible.Trigger>
            <Heading size="6">About</Heading>
          </Collapsible.Trigger>
          <Box className={styles.summaryContainer}>
            <Text>{companyProfile.summary}</Text>
            Founded in {companyProfile.founded}
            <br />
            Located in {companyProfile.hq}
            <br />
            {companyProfile.size} employees
            <br />
            {companyProfile.sector}
            <br />
          </Box>
        </Collapsible.Root>
      </Card>
    </Flex>
  )
}

export default CompanyPage
