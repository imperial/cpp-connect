import prisma from "@/lib/db"

import styles from "./page.module.scss"

import { Flex, Text } from "@radix-ui/themes"
import { notFound } from "next/navigation"
import React from "react"

const CompanyPage = async ({ params }: { params: { id: string } }) => {
  const companyProfile = await prisma.companyProfile.findUnique({ where: { id: parseInt(params.id) } })

  if (!companyProfile) {
    notFound()
  }

  return (
    <Flex gap="5" direction="column">
      <Flex>
        <Text>{companyProfile.name}</Text>
      </Flex>
      <Flex direction="column">
        <Text className={styles.subheading}>Summary</Text>
        <Text>{companyProfile.summary}</Text>
      </Flex>
      <Flex direction="row" wrap="wrap">
        <Flex>
          <Text className={styles.subheading}>Sector</Text>
          <Text>{companyProfile.sector}</Text>
        </Flex>
        <Flex>
          <Text className={styles.subheading}>Size</Text>
          <Text>{companyProfile.size ?? "N/A"}</Text>
        </Flex>
        <Flex>
          <Text className={styles.subheading}>HQ</Text>
          <Text>{companyProfile.hq ?? "N/A"}</Text>
        </Flex>
        {/* <Flex>
          <Text>Founded</Text>
          <Text>{companyProfile.founded ?? "N/A"}</Text>
        </Flex>
        <Flex>
          <Text>Contacts</Text>
          <Text>{companyProfile.website}</Text>
          <Text>{companyProfile.email ?? "N/A"}</Text>
          <Text>{companyProfile.phone ?? "N/A"}</Text>
        </Flex> */}
      </Flex>
    </Flex>
  )
}

export default CompanyPage
