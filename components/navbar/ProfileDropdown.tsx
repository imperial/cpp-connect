"use client"

import Link from "@/components/Link"
import UserAvatar from "@/components/UserAvatar"
import styles from "@/components/navbar/profileDropdown.module.scss"

import { RoleNavbarProps } from "./Navbar"

import { Role } from "@prisma/client"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Button, Flex, Heading, Text } from "@radix-ui/themes"
import { signOut, useSession } from "next-auth/react"
import React from "react"
import { BsBoxArrowRight, BsBuilding, BsPersonCircle } from "react-icons/bs"

interface DropdownCardProps {
  children?: React.ReactNode
  user: {
    name?: string | null
    email?: string | null
  }
}

const DropdownCard = (props: RoleNavbarProps & DropdownCardProps) => {
  return (
    <Flex className={styles.DropdownCard} gap="4" align="stretch">
      <Flex align="center">
        <UserAvatar user={{ image: props.avatar, name: props.user.name ?? undefined }} size="6" />
      </Flex>
      <Flex direction="column" gap="2" justify="between">
        <Heading>{props.user.name || props.user.email}</Heading>
        {props.children}
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
  const [open, setOpen] = React.useState(false)
  const { data } = useSession()
  const user = data?.user! // This component is only rendered when the user is logged in
  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <button className={styles.avatarButton}>
          <UserAvatar user={{ image: props.avatar, name: user.name ?? undefined }} size="3" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className={styles.DropdownMenuContent}>
        <DropdownCard {...props} user={user}>
          {props.role === Role.STUDENT && (
            <Button variant="outline" asChild>
              <Link
                href={`/students/${props.shortcode}`}
                radixProps={{
                  underline: "none",
                }}
                onClick={() => setOpen(false)}
              >
                <BsPersonCircle />
                <Text>Your Profile</Text>
              </Link>
            </Button>
          )}
          {props.role === "COMPANY" && (
            <Button variant="outline" asChild>
              <Link
                href={`/companies/${props.slug}`}
                radixProps={{
                  underline: "none",
                }}
                onClick={() => setOpen(false)}
              >
                <BsBuilding />
                <Text>Your Company</Text>
              </Link>
            </Button>
          )}
          {props.role === "ADMIN" && <Text>(ADMIN)</Text>}
        </DropdownCard>
        <DropdownMenu.Arrow className={styles.DropdownMenuArrow} />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default ProfileDropdown
