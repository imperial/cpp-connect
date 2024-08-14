import Link from "@/components/Link"

import styles from "./page.module.scss"

import { Button, Flex, Separator, Text } from "@radix-ui/themes"
import { Heading } from "@react-email/components"
import Image from "next/image"
import React from "react"

const LoginPage = async () => {
  return (
    <Flex gap="6" direction="column">
      <Flex className={styles.logosContainer}>
        <Image src="/images/imperial-logo-blue.svg" alt="imperial logo in blue" width={0} height={0} />
      </Flex>
      <Flex pl="9" pr="9" direction="column" gap="5">
        <Flex direction="column" justify="center" align="center">
          <Heading as="h1">CPP Connect</Heading>
          <Text>Giving you a head start in your career</Text>
        </Flex>
        <Separator size="4" />
        <Flex direction="column" gap="3">
          <Button size="3">Login with SSO</Button>
          <Link href="/auth/login/partner" style={{ textAlign: "center" }}>
            Industry Partner?
          </Link>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default LoginPage
