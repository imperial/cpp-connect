import { NavbarProps, RoleNavbarProps, isSignedIn } from "./Navbar"
import styles from "./mobileNavbar.module.scss"

import Link from "../Link"
import UserAvatar from "../UserAvatar"
import RestrictedAreaClient from "../rbac/RestrictedAreaClient"
import { CONTENT_ID, FOOTER_ID } from "../util/constants"
import { Role } from "@prisma/client"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Button, Flex, Heading, IconButton, Separator, Text } from "@radix-ui/themes"
import { signOut, useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import Image from "next/image"
import React, { useEffect, useState } from "react"
import {
  BsBoxArrowLeft,
  BsBoxArrowRight,
  BsBriefcase,
  BsBuilding,
  BsCalendar2Date,
  BsList,
  BsMortarboard,
  BsPersonCircle,
} from "react-icons/bs"
import { IconType } from "react-icons/lib"

const DarkModeToggle = dynamic(() => import("@/components/DarkModeToggle"), { ssr: false })

const SidebarLink = ({
  href,
  Icon,
  displayText,
  closeSidebar,
}: {
  href: string
  Icon: IconType
  displayText: string
  closeSidebar: () => void
}) => {
  return (
    <Link href={href} className={styles.link} radixProps={{ underline: "none" }} onClick={closeSidebar}>
      <Flex align="center" gap="3">
        <Icon />
        <Text>{displayText}</Text>
      </Flex>
    </Link>
  )
}

const UnauthenticatedContent = (props: { closeSidebar: () => void }) => {
  return <SidebarLink href="/auth/login" Icon={BsBoxArrowRight} displayText="Login" closeSidebar={props.closeSidebar} />
}

const AuthenticatedContent = (props: RoleNavbarProps & { closeSidebar: () => void }) => {
  const { data } = useSession()
  const user = data?.user! // This component is only rendered when the user is logged in
  return (
    <>
      <Flex width="100%" justify="center" direction="column" align="center" gap="2">
        <UserAvatar user={{ image: props.avatar, name: user.name }} size="5" />
        <Heading size="5" style={{ textAlign: "center" }}>
          {user.name || user.email}
        </Heading>
        {props.role === "ADMIN" && <Text>(ADMIN)</Text>}
      </Flex>

      {props.role === "STUDENT" && (
        <SidebarLink
          href={`/students/${props.shortcode}`}
          Icon={BsPersonCircle}
          displayText="Your Profile"
          closeSidebar={props.closeSidebar}
        />
      )}
      {props.role === "COMPANY" && (
        <SidebarLink
          href={`/companies/${props.slug}`}
          Icon={BsBuilding}
          displayText="Your Company"
          closeSidebar={props.closeSidebar}
        />
      )}

      <Separator orientation="horizontal" className={styles.Separator} />
      <RestrictedAreaClient allowedRoles={[Role.STUDENT]} showMessage={false}>
        <SidebarLink href="/companies" Icon={BsBuilding} displayText="Companies" closeSidebar={props.closeSidebar} />
        <SidebarLink href="/events" Icon={BsCalendar2Date} displayText="Events" closeSidebar={props.closeSidebar} />
        <SidebarLink
          href="/opportunities"
          Icon={BsBriefcase}
          displayText="Opportunities"
          closeSidebar={props.closeSidebar}
        />
      </RestrictedAreaClient>
      <SidebarLink href="/students" Icon={BsMortarboard} displayText="Students" closeSidebar={props.closeSidebar} />

      <Separator orientation="horizontal" className={styles.Separator} />

      <Button onClick={() => signOut()} className={styles.signOutButton + " " + styles.link}>
        <Flex align="center" gap="3">
          <BsBoxArrowLeft />
          <Text>Sign Out</Text>
        </Flex>
      </Button>
    </>
  )
}

const MobileNavbar = (props: NavbarProps) => {
  const [open, setOpen] = useState(false)
  const { data } = useSession()

  const handleToggle = (open: boolean) => {
    setOpen(open)
    if (open) {
      // Prevent scrolling when the menu is open
      document.documentElement.style.overflow = "hidden"
      // Dim rest of the page when the menu is open
      document.getElementById(CONTENT_ID)?.classList.add("dim")
      document.getElementById(FOOTER_ID)?.classList.add("dim")
    } else {
      // Allow scrolling when the menu is closed
      document.documentElement.style.overflow = "auto"
      // Undim rest of the page when the menu is closed
      document.getElementById(CONTENT_ID)?.classList.remove("dim")
      document.getElementById(FOOTER_ID)?.classList.remove("dim")
    }
  }

  // Pretend the sidebar is closed when the component is unmounted (e.g. when the page resizes)
  useEffect(() => {
    return () => {
      handleToggle(false)
    }
  }, [])

  return (
    <Flex className={styles.mobileNavbar} p="3">
      <DropdownMenu.Root open={open} onOpenChange={handleToggle}>
        <IconButton size="4" asChild>
          <DropdownMenu.Trigger>
            <BsList size="2em" />
          </DropdownMenu.Trigger>
        </IconButton>

        <DropdownMenu.Content className={styles.sidebar} align="start">
          <Flex direction="column" justify="between" height="100%">
            {isSignedIn(data, props) ? (
              <AuthenticatedContent {...props} closeSidebar={() => handleToggle(false)} />
            ) : (
              <UnauthenticatedContent closeSidebar={() => handleToggle(false)} />
            )}
            <DarkModeToggle />
          </Flex>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <Link href="/" asChild>
        <Flex gap="2em" className={styles.imageContainer}>
          <Image src="/images/cpp-connect-logo.svg" alt="cpp connect logo" width={0} height={0} />
          <Image src="/images/imperial-logo.svg" alt="imperial logo" width={0} height={0} />
        </Flex>
      </Link>
    </Flex>
  )
}

export default MobileNavbar
