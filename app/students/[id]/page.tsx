import Chip from "@/components/Chip"
import UserAvatar from "@/components/UserAvatar"
import StudentOnlyArea from "@/components/rbac/StudentOnlyArea"
import prisma from "@/lib/db"

import styles from "./page.module.scss"

import { Box, Card, Flex, Heading, Link, Text } from "@radix-ui/themes"
import { format } from "date-fns"
import { notFound } from "next/navigation"
import React from "react"
import { BsEnvelope, BsFileEarmarkText, BsGithub, BsGlobe, BsLinkedin } from "react-icons/bs"
import Markdown from "react-markdown"

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
      <Flex gap="3" direction="row" wrap="wrap">
        <Card variant="ghost" className={styles.shortDetailsCard}>
          <Flex direction="column" align="center" gap="5">
            <UserAvatar user={studentProfile.user} size="9" />

            <Flex align="center" gap="2">
              <Flex direction="column" align="center">
                <Heading size="7">{studentProfile.user.name}</Heading>
                <Text color="gray" size="1">
                  Last updated: {format(studentProfile.updatedAt, "dd/MM/yyyy")}
                </Text>
              </Flex>

              {studentProfile.cv && (
                <Link href={studentProfile.cv} target="_blank" mb={"0"}>
                  <BsFileEarmarkText size="35" title="download cv" color="black" />
                </Link>
              )}
            </Flex>

            {studentProfile.course && <Text>{studentProfile.course}</Text>}

            {(studentProfile.lookingFor || studentProfile.graduationDate) && (
              <Box>
                {studentProfile.lookingFor && <Text>Looking for {formatLookingFor(studentProfile.lookingFor)}</Text>}
                <br />
                {studentProfile.graduationDate && (
                  <Text>Graduating in {format(studentProfile.graduationDate, "MMMM, yyyy")}</Text>
                )}
              </Box>
            )}

            <Flex align="center" gap="2">
              <BsEnvelope />
              <Link href={`mailto:${studentProfile.user.email}`}>{studentProfile.user.email}</Link>
            </Flex>

            <Flex gap="2">
              {studentProfile.personalWebsite && (
                <Flex align="center" gap="2">
                  <Link href={studentProfile.personalWebsite} target="_blank">
                    <BsGlobe size="25" color="black" />
                  </Link>
                </Flex>
              )}

              {studentProfile.github && (
                <Flex align="center" gap="2">
                  <Link href={studentProfile.github} target="_blank">
                    <BsGithub size="25" color="black" />
                  </Link>
                </Flex>
              )}

              {studentProfile.linkedIn && (
                <Flex align="center" gap="2">
                  <Link href={studentProfile.linkedIn} target="_blank">
                    <BsLinkedin size="25" color="black" />
                  </Link>
                </Flex>
              )}
            </Flex>
          </Flex>
        </Card>

        <Card className={styles.longDetailsCard}>
          <Flex>
            <Flex direction="column" gap="3">
              {studentProfile.bio && (
                <Flex direction="column" gap="3">
                  <Heading size="5">About me</Heading>
                  <Markdown>{studentProfile.bio}</Markdown>
                </Flex>
              )}

              <Flex direction="column" gap="3">
                <Heading size="5">Skills</Heading>
                <Flex gap="1">
                  {studentProfile.skills.map((skill, id) => (
                    <Chip label={skill} key={id} />
                  ))}
                  {!studentProfile.skills.length && <Text>No skills listed</Text>}
                </Flex>
              </Flex>

              <Flex direction="column" gap="3">
                <Heading size="5">Interests</Heading>
                <Flex gap="1">
                  {studentProfile.interests.map((interest, id) => (
                    <Chip label={interest} key={id} />
                  ))}
                  {!studentProfile.interests.length && <Text>No interests listed</Text>}
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </Flex>
    </StudentOnlyArea>
  )
}

export default StudentProfilePage
