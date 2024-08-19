import { NavbarProps, RoleNavbarProps, isSignedIn } from "./Navbar"
import styles from "./mobileNavbar.module.scss"

import Link from "../Link"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { Button, Flex, IconButton, Link as RadixLink, Separator, Text } from "@radix-ui/themes"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import React, { ToggleEventHandler } from "react"
import { BsBoxArrowRight, BsList } from "react-icons/bs"

const UnauthenticatedContent = () => {
  return (
    <NavigationMenu.Link asChild>
      <Link href="/auth/login" className={styles.link} radixProps={{ underline: "none" }}>
        <span>Login</span>
      </Link>
    </NavigationMenu.Link>
  )
}

const AuthenticatedContent = (props: RoleNavbarProps) => {
  return (
    <>
      {props.role === "STUDENT" && (
        <NavigationMenu.Link asChild>
          <Link href={`/students/${props.shortcode}`} className={styles.link} radixProps={{ underline: "none" }}>
            <span>Your Profile</span>
          </Link>
        </NavigationMenu.Link>
      )}
      {props.role === "COMPANY" && (
        <NavigationMenu.Link asChild>
          <Link href={`/companies/${props.slug}`} className={styles.link} radixProps={{ underline: "none" }}>
            <span>Your Company</span>
          </Link>
        </NavigationMenu.Link>
      )}
      {props.role === "ADMIN" && <Text>(ADMIN)</Text>}
      <NavigationMenu.Link asChild>
        <Link href="/companies" className={styles.link} radixProps={{ underline: "none" }}>
          <span>Companies</span>
        </Link>
      </NavigationMenu.Link>
      <NavigationMenu.Link asChild>
        <Link href="/events" className={styles.link} radixProps={{ underline: "none" }}>
          <span>Events</span>
        </Link>
      </NavigationMenu.Link>
      <NavigationMenu.Link asChild>
        <Link href="/opportunities" className={styles.link} radixProps={{ underline: "none" }}>
          <span>Opportunities</span>
        </Link>
      </NavigationMenu.Link>
      <NavigationMenu.Link asChild>
        <Link href="/students" className={styles.link} radixProps={{ underline: "none" }}>
          <span>Students</span>
        </Link>
      </NavigationMenu.Link>
      <Separator orientation="horizontal" className={styles.Separator} />
      <RadixLink asChild className={styles.link}>
        <Button onClick={() => signOut()} variant="ghost" className={styles.signOutButton}>
          <Text>Sign out</Text>
        </Button>
      </RadixLink>
    </>
  )
}

const MobileNavbar = (props: NavbarProps) => {
  const { data } = useSession()

  const handleToggle = (value: string) => {
    if (value === "") {
      // Allow scrolling when the menu is closed
      document.documentElement.style.overflow = "auto"
      // Undim rest of the page when the menu is closed
      document.getElementById("page-container")?.classList.remove("dim")
      document.getElementById("footer")?.classList.remove("dim")
    } else {
      // Prevent scrolling when the menu is open
      document.documentElement.style.overflow = "hidden"
      // Dim rest of the page when the menu is open
      document.getElementById("page-container")?.classList.add("dim")
      document.getElementById("footer")?.classList.add("dim")
    }
  }

  return (
    <NavigationMenu.Root orientation="vertical" onValueChange={handleToggle}>
      <NavigationMenu.List className={styles.NavigationMenuList}>
        <NavigationMenu.Item className={styles.NavigationMenuItem}>
          <IconButton size="4" asChild>
            <NavigationMenu.Trigger>
              <BsList size="2em" />
            </NavigationMenu.Trigger>
          </IconButton>

          <NavigationMenu.Content className={styles.NavigationMenuContent}>
            {isSignedIn(data, props) ? <AuthenticatedContent {...props} /> : <UnauthenticatedContent />}
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item className={styles.NavigationMenuItem}>
          <Link href="/" asChild>
            <Flex gap="2em">
              <Image src="/images/cpp-connect-logo.svg" alt="cpp connect logo" width={0} height={0} />
              <Image src="/images/imperial-logo.svg" alt="imperial logo" width={0} height={0} />
            </Flex>
          </Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Viewport className={styles.NavigationMenuViewport} />
    </NavigationMenu.Root>
  )
}

export default MobileNavbar
