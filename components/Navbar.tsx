"use client"

import styles from "./navbar.module.css"

import { Flex } from "@radix-ui/themes"
import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import React from "react"

const Navbar = () => {
  const { data: session } = useSession()
  return (
    <Flex className={styles.container}>
      <Flex className={styles.logosContainer}>
        <Image src="images/cpp-connect-logo.svg" alt="cpp connect logo" width={100} height={75} />
        <Image src="images/imperial-logo.svg" alt="imperial logo" width={213} height={66} />
      </Flex>

      {/* change !session to session later */}
      <Flex className={styles.linksContainer}>
        <Link href="/">
          <span>Companies</span>
        </Link>
        <Link href="/">
          <span>Events</span>
        </Link>
        <Link href="/">
          <span>Opportunities</span>
        </Link>
        <Link href="/">
          <span>Students</span>
        </Link>
      </Flex>
    </Flex>
  )
}

export default Navbar
