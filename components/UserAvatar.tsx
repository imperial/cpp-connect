import styles from "@/components/userAvatar.module.scss"

import * as Avatar from "@radix-ui/react-avatar"
import { User } from "next-auth"
import React from "react"

const UserAvatar = ({ user, size }: { user: User; size: number }) => (
  <Avatar.Root className={styles.AvatarRoot} style={{ width: `${size}em`, height: `${size}em` }}>
    <Avatar.Image src={"/api/ms-graph/profile" ?? undefined} alt="Profile" className={styles.AvatarImage} />
    <Avatar.Fallback className={styles.AvatarFallback} style={{ fontSize: `${size / 2.5}em` }}>
      {user.name
        ?.split(",")
        .reverse()
        .join(" ")
        .split(/\s|-/g)
        .map(name => name[0]?.toUpperCase())
        .join("")}
    </Avatar.Fallback>
  </Avatar.Root>
)

export default UserAvatar
