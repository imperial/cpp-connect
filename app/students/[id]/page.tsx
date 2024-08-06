import prisma from "@/lib/db"

import styles from "./page.module.scss"

import { Card, Flex } from "@radix-ui/themes"
import { notFound } from "next/navigation"

const StudentProfilePage = async ({ params }: { params: { id: string } }) => {
  const studentProfile = await prisma.studentProfile.findUnique({ where: { userId: params.id } })

  if (!studentProfile) {
    notFound()
  }

  return (
    <Flex gap="3" direction="column">
      <Card className={styles.headerCard}>{studentProfile.personalWebsite}</Card>
    </Flex>
  )
}

export default StudentProfilePage
