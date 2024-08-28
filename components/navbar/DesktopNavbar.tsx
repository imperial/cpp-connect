"use client"

import Link from "@/components/Link"
import ProfileDropdown from "@/components/navbar/ProfileDropdown"

import { NavbarProps, isSignedIn } from "./Navbar"
import styles from "./desktopNavbar.module.scss"

import RestrictedAreaClient from "../rbac/RestrictedAreaClient"
import { Role } from "@prisma/client"
import { Flex } from "@radix-ui/themes"
import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { usePathname } from "next/navigation"
import React from "react"

const DarkModeToggle = dynamic(() => import("@/components/DarkModeToggle"), { ssr: false })

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const DesktopNavbar = (props: NavbarProps) => {
  const { data } = useSession()
  const pathname = usePathname()

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
              <RestrictedAreaClient allowedRoles={[Role.STUDENT]} showMessage={false}>
                {["companies", "events", "opportunities"].map((title, id) => (
                  <Link key={id} href={`/${title}`} className={styles.link} data-active={pathname === `/${title}`}>
                    <span>{title}</span>
                  </Link>
                ))}
              </RestrictedAreaClient>
              <Link href="/students" className={styles.link} data-active={pathname === "/students"}>
                <span>Students</span>
              </Link>
            </Flex>
          )}
        </Flex>

        <Flex align="center" gap="5">
          <DarkModeToggle fill="white" />
          {isSignedIn(data, props) ? (
            <ProfileDropdown {...props} />
          ) : (
            <Link href="/auth/login" className={styles.link}>
              <span>Log In</span>
            </Link>
          )}
        </Flex>
      </nav>
    </Flex>
  )
}

export default DesktopNavbar
