import { auth } from "@/auth"

import styles from "./navbar.module.css"

import * as Avatar from "@radix-ui/react-avatar"
import { Flex, Link } from "@radix-ui/themes"
import Image from "next/image"
import React from "react"

const Navbar = async () => {
  const session = await auth()
  return (
    <Flex className={styles.container} justify="between">
      <Flex gap="9" wrap="wrap">
        <Link href="/">
          <Flex className={styles.logosContainer}>
            <Image
              src="images/cpp-connect-logo.svg"
              alt="cpp connect logo"
              width={0}
              height={0}
              style={{ aspectRatio: "100/75" }}
            />
            <Image
              src="images/imperial-logo.svg"
              alt="imperial logo"
              width={0}
              height={0}
              style={{ aspectRatio: "213/66" }}
            />
          </Flex>
        </Link>

        {session?.user && (
          <Flex className={styles.linksContainer}>
            <Link href="/" className={styles.link}>
              <span>Companies</span>
            </Link>
            <Link href="/" className={styles.link}>
              <span>Events</span>
            </Link>
            <Link href="/" className={styles.link}>
              <span>Opportunities</span>
            </Link>
            <Link href="/" className={styles.link}>
              <span>Students</span>
            </Link>
          </Flex>
        )}
      </Flex>

      {session?.user ? (
        <Avatar.Root className={styles.AvatarRoot}>
          <Avatar.Image src={session.user.image ?? undefined} alt="Profile" className={styles.AvatarImage} />
          <Avatar.Fallback className={styles.AvatarFallback}>
            {session.user.name
              ?.split(",")
              .reverse()
              .join(" ")
              .split(/\s|\-/g)
              .map(name => name[0]?.toUpperCase())
              .join("")}
          </Avatar.Fallback>
        </Avatar.Root>
      ) : (
        <Link href="/login" className={styles.link}>
          <span>Log In</span>
        </Link>
      )}
    </Flex>
  )
}

export default Navbar
