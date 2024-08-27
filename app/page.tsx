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
    <Flex className="landing-page" direction="column" justify="between" align="center" gap="6" pb="6" asChild>
      <main>
        <Flex className={styles.intro} align="center" wrap="wrap">
          <Flex className={styles.introText} direction="column" align="center" justify="center" gap="8">
            <Heading size="9">CPP Connect</Heading>

            <Flex gap="3" wrap="wrap" align="center" justify="center">
              <AnimatedButton asChild className={styles.signInButton} size="4">
                <Link href="/auth/login" radixProps={{ underline: "none" }}>
                  Student Login
                </Link>
              </AnimatedButton>
              <AnimatedButton asChild className={styles.signInButton} size="4">
                <Link href="/auth/login/partner" radixProps={{ underline: "none" }}>
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
        <SlideCard variant="ghost" className={styles.slideCard}>
          <Flex wrap="wrap" gap="9" align="center" justify="center">
            <Image
              src="/images/imperial-entrance.jpg"
              width={0}
              height={0}
              unoptimized
              alt="Imperial Main Entrance"
              className={styles.entranceImage}
            />
            <Flex direction="column" style={{ justifyContent: "space-around" }} gap="9">
              <Heading as="h2">What we offer for students</Heading>
              <Text size="4">
                <ul>
                  <li>Quick and convenient access to exclusive employers</li>
                  <li>An opportunity to showcase your skills to Imperial corporate partners</li>
                  <li>Search tools to find the opportunity that best fits your needs</li>
                </ul>
              </Text>
              <Button asChild size="4">
                <Link href="/auth/login" radixProps={{ underline: "none" }}>
                  Get Started
                </Link>
              </Button>
            </Flex>
          </Flex>
        </SlideCard>
      </main>
    </Flex>
  )
}

export const dynamic = "force-dynamic"
export default Home
