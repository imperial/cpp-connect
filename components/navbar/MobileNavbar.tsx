import { NavbarProps, RoleNavbarProps, isSignedIn } from "./Navbar"
import styles from "./mobileNavbar.module.scss"

import Link from "../Link"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { Button, Flex, IconButton, Link as RadixLink, Separator, Text } from "@radix-ui/themes"
import { signOut, useSession } from "next-auth/react"
import Image from "next/image"
import React, { ToggleEventHandler } from "react"
import {
  BsBoxArrowLeft,
  BsBriefcase,
  BsBuilding,
  BsCalendar2Date,
  BsList,
  BsMortarboard,
  BsPersonCircle,
} from "react-icons/bs"
import { IconType } from "react-icons/lib"

const SidebarLink = ({ href, Icon, displayText }: { href: string; Icon: IconType; displayText: string }) => {
  return (
    <NavigationMenu.Link asChild>
      <Link href={href} className={styles.link} radixProps={{ underline: "none" }}>
        <Flex align="center" gap="3">
          <Icon />
          <Text>{displayText}</Text>
        </Flex>
      </Link>
    </NavigationMenu.Link>
  )
}

const UnauthenticatedContent = () => {
  return (
    <NavigationMenu.Link asChild>
      <Link href="/auth/login" className={styles.link} radixProps={{ underline: "none" }}>
        Login
      </Link>
    </NavigationMenu.Link>
  )
}

const AuthenticatedContent = (props: RoleNavbarProps) => {
  return (
    <>
      {props.role === "STUDENT" && (
        <SidebarLink href={`/students/${props.shortcode}`} Icon={BsPersonCircle} displayText="Your Profile" />
      )}
      {props.role === "COMPANY" && (
        <SidebarLink href={`/companies/${props.slug}`} Icon={BsBuilding} displayText="Your Company" />
      )}
      {props.role === "ADMIN" && <Text>(ADMIN)</Text>}
      <SidebarLink href="/companies" Icon={BsBuilding} displayText="Companies" />
      <SidebarLink href="/events" Icon={BsCalendar2Date} displayText="Events" />
      <SidebarLink href="/opportunities" Icon={BsBriefcase} displayText="Opportunities" />
      <SidebarLink href="/students" Icon={BsMortarboard} displayText="Students" />

      <Separator orientation="horizontal" className={styles.Separator} />
      <NavigationMenu.Link asChild className={styles.link}>
        <Button onClick={() => signOut()} variant="ghost" className={styles.signOutButton}>
          <Flex align="center" gap="3">
            <BsBoxArrowLeft />
            <Text>Sign Out</Text>
          </Flex>
        </Button>
      </NavigationMenu.Link>
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
