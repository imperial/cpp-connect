import prisma from "@/lib/db"

import styles from "./page.module.scss"

import { Card, Flex, Inset } from "@radix-ui/themes"
import Image from "next/image"
import { notFound } from "next/navigation"
import React from "react"

const EventPage = async ({ params }: { params: { id: string } }) => {
  const event = await prisma.event.findUnique({ where: { id: parseInt(params.id) }, include: { company: true } })
  if (!event) {
    notFound()
  }

  const companyBanner = (
    await prisma.companyProfile.findUnique({
      where: { id: event.companyID },
      select: { banner: true },
    })
  )?.banner

  return (
    <Flex gap="3" direction="column">
      <Card className={styles.headerCard}>
        <Inset clip="padding-box" p="0" side="top">
          <Image
            src={companyBanner ?? ""}
            alt={`${event.company.name} banner`}
            width={0}
            height={0}
            className={styles.banner}
          />
        </Inset>
      </Card>

      <Card></Card>
    </Flex>
  )
}

export default EventPage
