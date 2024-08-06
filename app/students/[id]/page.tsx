import UserAvatar from "@/components/UserAvatar"
import StudentOnlyArea from "@/components/rbac/StudentOnlyArea"
import prisma from "@/lib/db"

import styles from "./page.module.scss"

import { Flex, Heading, Text } from "@radix-ui/themes"
import { format } from "date-fns"
import { notFound } from "next/navigation"

const formatLookingFor = (lookingFor: string) => {
  switch (lookingFor) {
    case "Internship":
      return "an internship"
    case "Graduate Job":
      return "a graduate job"
    case "Part-time Job":
      return "a part-time job"
    case "Full-time Job":
      return "a full-time job"
    default:
      return lookingFor
  }
}

const StudentProfilePage = async ({ params }: { params: { id: string } }) => {
  const studentProfile = await prisma.studentProfile.findUnique({
    where: { userId: params.id },
    include: {
      user: true,
    },
  })

  if (!studentProfile) {
    notFound()
  }

  return (
    <StudentOnlyArea>
      <Flex gap="3" direction="row" style={{ border: "solid black 1px" }}>
        <Flex direction="column" align="center" gap="5">
          <UserAvatar user={studentProfile.user} size={10} />
          <Flex direction="column" align="center">
            <Heading size="7">{studentProfile.user.name}</Heading>
            <Text color="gray" size="1">
              Last updated: {format(studentProfile.updatedAt, "dd/MM/yyyy")}
            </Text>
          </Flex>
          {studentProfile.course && <Text>{studentProfile.course}</Text>}
          {studentProfile.lookingFor && <Text>Looking for {formatLookingFor(studentProfile.lookingFor)}</Text>}
          {studentProfile.graduationDate && (
            <Text>Graduating in {format(studentProfile.graduationDate, "MMMM, yyyy")}</Text>
          )}
        </Flex>
      </Flex>
    </StudentOnlyArea>
  )
}

export default StudentProfilePage
