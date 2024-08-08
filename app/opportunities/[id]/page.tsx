import prisma from "@/lib/db"

import styles from "./page.module.scss"

import { Card, Flex, Inset } from "@radix-ui/themes"
import Image from "next/image"
import { notFound } from "next/navigation"
import React from "react"

const OpportunityPage = async ({ params }: { params: { id: string } }) => {
  const opportunity = await prisma.opportunity.findUnique({
    where: { id: parseInt(params.id) },
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

        <Flex wrap="wrap" direction="column"></Flex>
      </Card>

      <Card className={styles.aboutCard}></Card>
    </Flex>
  )
}

export default OpportunityPage
