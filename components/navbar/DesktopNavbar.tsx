"use client"

import Link from "@/components/Link"
import ProfileDropdown from "@/components/navbar/ProfileDropdown"

import { NavbarProps, RoleNavbarProps } from "./Navbar"
import styles from "./desktopNavbar.module.scss"

import { Flex } from "@radix-ui/themes"
import { Session } from "next-auth"
import { useSession } from "next-auth/react"
import Image from "next/image"
import React from "react"

const isSignedIn = (data: Session | null, props: NavbarProps): props is RoleNavbarProps => !!(data && data.user)

const DesktopNavbar = (props: NavbarProps) => {
  const { data } = useSession()

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

          {isSignedIn(data, props) && (
            <Flex className={styles.linksContainer}>
              <Link href="/companies" className={styles.link}>
                <span>Companies</span>
              </Link>
              <Link href="/events" className={styles.link}>
                <span>Events</span>
              </Link>
              <Link href="/opportunities" className={styles.link}>
                <span>Opportunities</span>
              </Link>
              <Link href="/students" className={styles.link}>
                <span>Students</span>
              </Link>
            </Flex>
          )}
        </Flex>

        {isSignedIn(data, props) ? (
          <ProfileDropdown {...props} />
        ) : (
          <Link href="/auth/login" className={styles.link}>
            <span>Log In</span>
          </Link>
        )}
      </nav>
    </Flex>
  )
}

export default DesktopNavbar
