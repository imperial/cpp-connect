import { DropdownCard } from "@/components/DropdownCard"
import UserAvatar from "@/components/UserAvatar"
import styles from "@/components/profileDropdown.module.scss"
import getCompanySlug from "@/lib/getCompanySlug"
import getStudentShortcode from "@/lib/getStudentShortcode"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Button, Link, Text } from "@radix-ui/themes"
import { Session } from "next-auth"
import React from "react"
import { BsBuilding, BsPersonCircle } from "react-icons/bs"

const ProfileDropdown = async ({ user }: { user: Session["user"] }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className={styles.avatarButton}>
          <UserAvatar user={user} size="4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className={styles.DropdownMenuContent}>
        <DropdownCard user={user}>
          {user.role === "STUDENT" && (
            <Button variant="outline" asChild>
              <Link href={`/students/${(await getStudentShortcode(user)) ?? ""}`} underline="none">
                <BsPersonCircle />
                <Text>Your Profile</Text>
              </Link>
            </Button>
          )}
          {user.role === "COMPANY" && (
            <Button variant="outline" asChild>
              <Link href={`/companies/${(await getCompanySlug(user)) ?? ""}`} underline="none">
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
