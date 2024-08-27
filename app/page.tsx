import { auth } from "@/auth"
import Link from "@/components/Link"
import SlideCard from "@/components/SlideCard"
import { AnimatedButton } from "@/components/buttons/AnimatedButton"
import getCompanySlug from "@/lib/getCompanySlug"
import "@/styling/globals.scss"

import { getCompanyLink } from "./companies/getCompanyLink"
import styles from "./page.module.scss"

import { Role } from "@prisma/client"
import { Box, Button, Flex, Heading, Text } from "@radix-ui/themes"
import Image from "next/image"
import { redirect } from "next/navigation"
import * as React from "react"
import { BsBuilding, BsMortarboard } from "react-icons/bs"

interface InfoCardProps {
  direction: "left" | "right"
  imageSrc: string
  imageAlt: string
  title: string
  children: React.ReactNode
}

const InfoCard: React.FC<InfoCardProps> = ({ direction, imageSrc, imageAlt, title, children }) => (
  <SlideCard variant="ghost" className={styles.slideCard} direction={direction}>
    <Flex wrap="wrap" gap="9" align="center" justify="center" direction={direction === "left" ? "row" : "row-reverse"}>
      <Image src={imageSrc} width={0} height={0} unoptimized alt={imageAlt} />
      <Flex direction="column" className={styles.contents} gap="9">
        <Heading as="h2">{title}</Heading>
        {children}
      </Flex>
    </Flex>
  </SlideCard>
)

const Home = async () => {
  const session = await auth()

  // Authenticated users don't see the landing page
  if (session?.user) {
    switch (session.user.role) {
      case Role.ADMIN:
        return redirect("/companies")
      case Role.COMPANY:
        const companySlug = await getCompanySlug(session.user)
        if (!companySlug) {
          return redirect("/companies")
        }
        return redirect(getCompanyLink({ slug: companySlug }))
      case Role.STUDENT:
        return redirect("/opportunities")
    }
  }

  return (
    <Flex className="landing-page" direction="column" justify="between" align="center" gap="9" pb="6" asChild>
      <main>
        <Flex className={styles.intro} align="center" wrap="wrap">
          <Flex className={styles.introText} direction="column" align="center" justify="center" gap="8">
            <Heading size="9">CPP Connect</Heading>

            <Flex gap="3" wrap="wrap" align="center" justify="center">
              <AnimatedButton asChild className={styles.signInButton} size="4">
                <Link href="/auth/login" radixProps={{ underline: "none" }}>
                  <BsMortarboard />
                  Student Login
                </Link>
              </AnimatedButton>
              <AnimatedButton asChild className={styles.signInButton} size="4">
                <Link href="/auth/login/partner" radixProps={{ underline: "none" }}>
                  <BsBuilding />
                  Partner Login
                </Link>
              </AnimatedButton>
            </Flex>
          </Flex>
          <Image
            src="/images/imperial-entrance.jpg"
            width={0}
            height={0}
            unoptimized
            alt="Imperial Main Entrance"
            className={styles.entranceImage}
          />
        </Flex>

        <InfoCard
          direction="left"
          imageSrc="images/students.jpg"
          imageAlt="Imperial Students"
          title="What we offer for students"
        >
          <Text size="4">
            <ul>
              <li>Quick and convenient access to exclusive employers</li>
              <li>An opportunity to showcase your skills to Imperial corporate partners</li>
              <li>Search tools to find the opportunity that best fits your needs</li>
            </ul>
          </Text>
          <Button asChild size="4">
            <Link href="/auth/login" radixProps={{ underline: "none" }}>
              Find Opportunities
            </Link>
          </Button>
        </InfoCard>

        <InfoCard
          direction="right"
          imageSrc="/images/partners.jpg"
          imageAlt="Imperial Campus"
          title="What we offer for corporate partners"
        >
          <Text size="4">
            <ul>
              <li>Publish jobs and events directly to Imperial students</li>
              <li>Search the best students by their degree, graduation date and skills</li>
              <li>Meet top students at events hosted by Imperial</li>
            </ul>
          </Text>
          <Button asChild size="4">
            <Link href="/auth/login/partner" radixProps={{ underline: "none" }}>
              Get Started
            </Link>
          </Button>
        </InfoCard>

        <InfoCard
          direction="left"
          imageSrc="/images/alumni.jpg"
          imageAlt="Imperial Alumni"
          title="What we offer for alumni"
        >
          <Text size="4">
            <ul>
              <li>Gain access to job posting by Corporate Partners</li>
              <li>Keep up to date with employer events and opportunities</li>
              <li>Discover contacts among ex-students and industry partners</li>
            </ul>
          </Text>
          <Button asChild size="4">
            <Link href="/auth/login/" radixProps={{ underline: "none" }}>
              Connect Now
            </Link>
          </Button>
        </InfoCard>
      </main>
    </Flex>
  )
}

export const dynamic = "force-dynamic"
export default Home
