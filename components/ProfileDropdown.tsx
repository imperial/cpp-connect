import { DropdownCard } from "@/components/DropdownCard"
import UserAvatar from "@/components/UserAvatar"
import styles from "@/components/profileDropdown.module.scss"
import getStudentShortcode from "@/lib/getStudentShortcode"

import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Session } from "next-auth"
import React from "react"

const ProfileDropdown = async ({ user }: { user: Session["user"] }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className={styles.avatarButton}>
          <UserAvatar user={user} size="4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className={styles.DropdownMenuContent}>
        <DropdownCard user={user} shortcode={(await getStudentShortcode(user)) ?? ""} />
        <DropdownMenu.Arrow fill="white" />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export default ProfileDropdown
