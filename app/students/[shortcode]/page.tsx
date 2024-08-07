import Chip from "@/components/Chip"
import UserAvatar from "@/components/UserAvatar"
import RestrictedArea from "@/components/rbac/RestrictedArea"
import prisma from "@/lib/db"

import styles from "./page.module.scss"

import { OpportunityType } from "@prisma/client"
import { Box, Card, Flex, Heading, Link, Text } from "@radix-ui/themes"
import { format } from "date-fns"
import { notFound } from "next/navigation"
import React from "react"
import { BsEnvelope, BsFileEarmarkText, BsGithub, BsGlobe, BsLinkedin } from "react-icons/bs"
import { IconType } from "react-icons/lib"
import Markdown from "react-markdown"

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
      return "an internship"
    case "Placement":
      return "a placement"
    case "Graduate":
      return "a graduate job"
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
        <Icon size={linkIconSize} color="black" />
      </Link>
    </Flex>
  ) : (
    <> </>
  )

const StudentProfilePage = async ({ params }: { params: { shortcode: string } }) => {
  const studentProfile = await prisma.studentProfile.findFirst({
    where: { studentShortcode: params.shortcode },
    include: {
      user: true,
    },
  })

  if (!studentProfile) {
    notFound()
  }

  return (
    <RestrictedArea allowedRoles={["STUDENT"]}>
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
              <StudentWebsiteLink href={studentProfile.personalWebsite} icon={BsGlobe} />
              <StudentWebsiteLink href={studentProfile.github} icon={BsGithub} />
              <StudentWebsiteLink href={studentProfile.linkedIn} icon={BsLinkedin} />
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
    </RestrictedArea>
  )
}

export default StudentProfilePage
