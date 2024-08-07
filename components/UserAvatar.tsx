import styles from "@/components/userAvatar.module.scss"

import { Avatar } from "@radix-ui/themes"
import { User } from "next-auth"
import React from "react"

const UserAvatar = ({ user, size }: { user: User; size: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" }) => (
  <Avatar
    src={"/api/ms-graph/profile" ?? undefined}
    alt="Profile"
    radius="full"
    size={size}
    style={{ fontSize: `${parseInt(size) / 3.5}rem` }}
    className={styles.Avatar}
    fallback={
      user.name
        ?.split(",")
        .reverse()
        .join(" ")
        .split(/\s|-/g)
        .map(name => name[0]?.toUpperCase())
        .join("") ?? ""
    }
  />
)

export default UserAvatar
