import { auth } from "@/auth"

import UserAvatar from "./UserAvatar"
import styles from "./navbar.module.scss"

import { Flex, Link } from "@radix-ui/themes"
import Image from "next/image"
import React from "react"

const Navbar = async () => {
  const session = await auth()
  return (
    <Flex className={styles.container} justify="between" asChild>
      <nav>
        <Flex gap="9" wrap="wrap">
          <Link href="/">
            <Flex className={styles.logosContainer}>
              <Image src="/images/cpp-connect-logo.svg" alt="cpp connect logo" width={0} height={0} />
              <Image src="/images/imperial-logo.svg" alt="imperial logo" width={0} height={0} />
            </Flex>
          </Link>

          {session?.user && (
            <Flex className={styles.linksContainer}>
              <Link href="/companies" className={styles.link}>
                <span>Companies</span>
              </Link>
              <Link href="/" className={styles.link}>
                <span>Events</span>
              </Link>
              <Link href="/opportunities" className={styles.link}>
                <span>Opportunities</span>
              </Link>
              <Link href="/" className={styles.link}>
                <span>Students</span>
              </Link>
            </Flex>
          )}
        </Flex>

        {session?.user ? (
          <UserAvatar user={session.user} />
        ) : (
          <Link href="/login" className={styles.link}>
            <span>Log In</span>
          </Link>
        )}
      </nav>
    </Flex>
  )
}

export default Navbar
