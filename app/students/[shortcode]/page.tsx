import { auth } from "@/auth"
import Chip from "@/components/Chip"
import { EditStudent } from "@/components/EditStudent"
import { FileViewer } from "@/components/FileViewer"
import Link from "@/components/Link"
import MdViewer from "@/components/MdViewer"
import UserAvatar from "@/components/UserAvatar"
import RestrictedArea from "@/components/rbac/RestrictedArea"
import RestrictedAreaStudent from "@/components/rbac/RestrictedAreaStudent"
import prisma from "@/lib/db"

import styles from "./page.module.scss"

import { OpportunityType, Role } from "@prisma/client"
import { Box, Card, Flex, Heading, Separator, Text } from "@radix-ui/themes"
import { format } from "date-fns"
import { notFound } from "next/navigation"
import React from "react"
import { BsEnvelope, BsFileEarmarkText, BsGithub, BsGlobe, BsLinkedin } from "react-icons/bs"
import { IconType } from "react-icons/lib"

const linkIconSize = "25"

/**
 * Formats the looking for field into a human readable string.
 * @param lookingFor The looking for field from the student profile.
 * @returns A human readable string.
 * @example formatLookingFor("Internship") => "an internship"
 */
const formatLookingFor = (lookingFor: OpportunityType) => {
  switch (lookingFor) {
    case "Internship":
      return "Looking for an internship"
    case "Placement":
      return "Looking for a placement"
    case "Graduate":
      return "Looking for a graduate job"
    case "Not_Looking_For_Work":
      return "Not looking for work"
  }
}

/**
 * A link to a student's website - rendered conditionally based on if the URL is provided or not
 * @param href The URL of the student's website.
 * @param icon The icon to display.
 */
const StudentWebsiteLink = ({ href, icon: Icon }: { href?: string | null; icon: IconType }) =>
  href ? (
    <Flex align="center" gap="2">
      <Link href={href} target="_blank">
        <Icon size={linkIconSize} color="var(--gray-12)" />
      </Link>
    </Flex>
  ) : (
    <> </>
  )

const StudentProfilePage = async ({ params }: { params: { shortcode: string } }) => {
  const studentProfile = await prisma.studentProfile.findFirst({
    where: { studentShortcode: decodeURIComponent(params.shortcode) },
    include: {
      user: true,
    },
  })

  if (!studentProfile) {
    notFound()
  }

  const firstName = studentProfile.user.name?.split(",").reverse()[0].trim()

  return (
    <RestrictedArea allowedRoles={["STUDENT", "COMPANY"]}>
      <Card className={styles.container}>
        <Flex gap="3" direction="row" wrap="wrap">
          <Flex direction="column" align="center" gap="5" className={styles.shortDetailsCard} p="5">
            <UserAvatar user={studentProfile.user} size="9" />

            <Flex align="center" gap="2">
              <Flex direction="column" align="center">
                <Heading size="7">{studentProfile.user.name}</Heading>
                <Text color="gray" size="1">
                  Last updated: {format(studentProfile.updatedAt, "dd/MM/yyyy")}
                </Text>
              </Flex>
            </Flex>

            {studentProfile.course && <Text>{studentProfile.course}</Text>}

            {(studentProfile.lookingFor || studentProfile.graduationDate) && (
              <Flex gap="2" direction="column">
                {studentProfile.lookingFor && <Text>{formatLookingFor(studentProfile.lookingFor)}</Text>}
                {studentProfile.graduationDate && (
                  <Text>Graduating in {format(studentProfile.graduationDate, "MMMM, yyyy")}</Text>
                )}
              </Flex>
            )}

            {studentProfile.cv && (
              <RestrictedArea
                showMessage={false}
                allowedRoles={["COMPANY", "STUDENT"]}
                additionalCheck={async session =>
                  session.user.role === "COMPANY" || session.user.id === studentProfile.userId
                }
              >
                <FileViewer fileUrl={`/api/uploads/${studentProfile.cv}`} title={`${firstName}'s CV`}>
                  <Link asChild href="">
                    <Flex align="center" gap="2">
                      <BsFileEarmarkText title="view cv" color="var(--gray-12)" />
                      <Text>{firstName}&apos;s CV</Text>
                    </Flex>
                  </Link>
                </FileViewer>
              </RestrictedArea>
            )}
            <Flex align="center" gap="2">
              <BsEnvelope />
              <Link href={`mailto:${studentProfile.user.email}`}>{studentProfile.user.email}</Link>
            </Flex>

            <Flex gap="2">
              <StudentWebsiteLink href={studentProfile.personalWebsite} icon={BsGlobe} />
              <StudentWebsiteLink href={studentProfile.github} icon={BsGithub} />
              <StudentWebsiteLink href={studentProfile.linkedIn} icon={BsLinkedin} />
            </Flex>
          </Flex>

          <Separator orientation="vertical" className={styles.Separator} />

          <Flex p="5" className={styles.longDetailsCard}>
            <Flex direction="column" gap="3">
              {studentProfile.bio && (
                <Flex direction="column" gap="3">
                  <Heading size="5">About me</Heading>
                  <MdViewer markdown={studentProfile.bio} />
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
            <Box position="absolute" top="2" right="2">
              <RestrictedAreaStudent showMessage={false} studentId={studentProfile.userId}>
                <EditStudent prevStudentProfile={studentProfile} isAdmin={(await auth())!.user.role === Role.ADMIN} />
              </RestrictedAreaStudent>
            </Box>
          </Flex>
        </Flex>
      </Card>
    </RestrictedArea>
  )
}

export default StudentProfilePage
