import Link from "@/components/Link"
import "@/styling/globals.scss"

import styles from "./page.module.scss"

import { Box, Button, Flex, Heading, Text } from "@radix-ui/themes"
import Image from "next/image"
import * as React from "react"

const Home = async () => {
  return (
    <main className={styles.main + " landing-page"}>
      <Flex className={styles.intro} align="center" wrap="wrap">
        <Flex className={styles.introText} direction="column" align="center" justify="center" gap="8">
          <Heading size="9">CPP Connect</Heading>

          <Flex gap="3" wrap="wrap" align="center" justify="center">
            <Button asChild className={styles.signInButton} size="4">
              <Link href="/auth/login" radixProps={{ underline: "none" }}>
                Student Login
              </Link>
            </Button>
            <Button asChild className={styles.signInButton} size="4">
              <Link href="/auth/login/partner" radixProps={{ underline: "none" }}>
                Partner Login
              </Link>
            </Button>
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
