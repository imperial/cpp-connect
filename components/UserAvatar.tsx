import styles from "@/components/userAvatar.module.scss"

import { Avatar } from "@radix-ui/themes"
import { User } from "next-auth"
import React from "react"
import { BsPersonCircle } from "react-icons/bs"

const UserAvatar = ({ user, size }: { user: User; size: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" }) => (
  <Avatar
    alt="Profile"
    radius="full"
    src={`/api/uploads/${user.image}`}
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
        .join("") ?? <BsPersonCircle size="95%" />
    }
  />
)

export default UserAvatar
