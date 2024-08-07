import { auth } from "@/auth"
import prisma from "@/lib/db"

import UserAvatar from "./UserAvatar"
import styles from "./navbar.module.scss"

import { DropdownMenu, Flex, Link } from "@radix-ui/themes"
import { Session } from "next-auth"
import Image from "next/image"
import React from "react"

const Navbar = async () => {
  const session = await auth()

  // Get the eIDPreferredUsername from the user for the profile link
  const getEIDPreferredUsername = async (user: Session["user"]) => {
    return (
      await prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          eIDPreferredUsername: true,
        },
      })
    )?.eIDPreferredUsername
  }

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
              <Link href="/" className={styles.link}>
                <span>Companies</span>
              </Link>
              <Link href="/events" className={styles.link}>
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
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <button className={styles.avatarButton}>
                <UserAvatar user={session.user} size="4" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Item>
                <Link
                  href={`/students/${(await getEIDPreferredUsername(session.user))?.split("@")[0]}`}
                  className={styles.link}
                >
                  Profile
                </Link>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
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
