import { auth } from "@/auth"
import Link from "@/components/Link"
import { AnimatedButton } from "@/components/buttons/AnimatedButton"
import getCompanySlug from "@/lib/getCompanySlug"
import "@/styling/globals.scss"

import { getCompanyLink } from "./companies/getCompanyLink"
import styles from "./page.module.scss"

import { Role } from "@prisma/client"
import { Flex, Heading } from "@radix-ui/themes"
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
    <main className={styles.main + " landing-page"}>
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
    </main>
  )
}

export const dynamic = "force-dynamic"
export default Home
