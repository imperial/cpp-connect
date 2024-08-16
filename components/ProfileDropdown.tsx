"use client"

import { DropdownCard } from "@/components/DropdownCard"
import UserAvatar from "@/components/UserAvatar"
import styles from "@/components/profileDropdown.module.scss"

import { RoleNavbarProps } from "./Navbar"

import { Role } from "@prisma/client"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Button, Link, Text } from "@radix-ui/themes"
import { useSession } from "next-auth/react"
import React from "react"
import { BsBuilding, BsPersonCircle } from "react-icons/bs"

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
