import Link from "@/components/Link"

import styles from "./page.module.scss"

import { Button, Flex, Separator } from "@radix-ui/themes"
import Image from "next/image"
import React from "react"

const LoginPage = async () => {
  return (
    <Flex gap="5" direction="column">
      <Flex className={styles.logosContainer}>
        <Image src="/images/imperial-logo-blue.svg" alt="imperial logo in blue" width={0} height={0} />
      </Flex>
      <Flex pl="9" pr="9" direction="column" gap="4">
        <Button size="3">Login with SSO</Button>
        <Button size="3" asChild>
          <Link href="/auth/login/partner">Partner Sign In</Link>
        </Button>
      </Flex>
    </Flex>
  )
}

export default LoginPage
