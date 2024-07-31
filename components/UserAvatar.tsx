import styles from "@/components/userAvatar.module.css"

import * as Avatar from "@radix-ui/react-avatar"
import { User } from "next-auth"
import React from "react"

const UserAvatar = ({ user }: { user: User }) => (
  <Avatar.Root className={styles.AvatarRoot}>
    <Avatar.Image src={user.image ?? undefined} alt="Profile" className={styles.AvatarImage} />
    <Avatar.Fallback className={styles.AvatarFallback}>
      {user.name
        ?.split(",")
        .reverse()
        .join(" ")
        .split(/\s|\-/g)
        .map(name => name[0]?.toUpperCase())
        .join("")}
    </Avatar.Fallback>
  </Avatar.Root>
)

export default UserAvatar
