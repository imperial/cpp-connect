import Chip from "@/components/Chip"
import prisma from "@/lib/db"

import styles from "./page.module.scss"

import { Box, Button, Card, Flex, Heading, Inset } from "@radix-ui/themes"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import React from "react"
import { BsBoxArrowUpRight } from "react-icons/bs"

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

        <Flex wrap="wrap" direction="column" p="5" gap="5">
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

          <Button asChild size="4" className={styles.applyButton}>
            <Link href={opportunity.link} target="_blank">
              Apply Now
              <BsBoxArrowUpRight />
            </Link>
          </Button>
        </Flex>
      </Card>

      <Card className={styles.aboutCard}></Card>
    </Flex>
  )
}

export default OpportunityPage
