"use client"

import UserAvatar from "@/components/UserAvatar"
import styles from "@/components/navbar/profileDropdown.module.scss"

import { RoleNavbarProps } from "./Navbar"

import { Role } from "@prisma/client"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Button, Flex, Heading, Link, Text } from "@radix-ui/themes"
import { Session } from "next-auth"
import { signOut, useSession } from "next-auth/react"
import React from "react"
import { BsBoxArrowRight, BsBuilding, BsPersonCircle } from "react-icons/bs"

const DropdownCard = ({ user, children }: { user: Session["user"]; children?: React.ReactNode }) => {
  return (
    <Flex className={styles.DropdownCard} gap="4" align="stretch">
      <Flex align="center">
        <UserAvatar user={user} size="6" />
      </Flex>
      <Flex direction="column" gap="2" justify="between">
        <Heading>{user.name || user.email}</Heading>
        {children}
        <Button color="red" onClick={() => signOut()} variant="outline">
          <Flex gap="2" align="center">
            <BsBoxArrowRight />
            <Text>Sign out</Text>
          </Flex>
        </Button>
      </Flex>
    </Flex>
  )
}

const ProfileDropdown = (props: RoleNavbarProps) => {
  const { data } = useSession()
  const user = data?.user! // This component is only rendered when the user is logged in

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className={styles.avatarButton}>
          <UserAvatar user={user} size="4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className={styles.DropdownMenuContent}>
        <DropdownCard user={user}>
          {props.role === Role.STUDENT && (
            <Button variant="outline" asChild>
              <Link href={`/students/${props.shortcode}`} underline="none">
                <BsPersonCircle />
                <Text>Your Profile</Text>
              </Link>
            </Button>
          )}
          {props.role === "COMPANY" && (
            <Button variant="outline" asChild>
              <Link href={`/companies/${props.slug}`} underline="none">
                <BsBuilding />
                <Text>Your Company</Text>
              </Link>
            </Button>
          )}
        </DropdownCard>
        <DropdownMenu.Arrow fill="white" />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default ProfileDropdown
