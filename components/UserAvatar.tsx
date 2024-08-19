import styles from "@/components/userAvatar.module.scss"

import { Avatar } from "@radix-ui/themes"
import React from "react"
import { BsPersonCircle } from "react-icons/bs"

const UserAvatar = ({
  user,
  size,
}: {
  user: { image?: string | null; name?: string | null }
  size: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
}) => (
  <Avatar
    alt="Profile"
    radius="full"
    src={(user.image ?? undefined) && `/api/uploads/${user.image}`}
    size={size}
    style={{
      fontSize: `${parseInt(size) / 3.5}rem`,
    }}
    className={styles.Avatar}
    fallback={
      user.name
        ?.split(",") // "Last-Name, FirstName" => ["Last-Name", "FirstName"]
        .reverse() // ["Last-Name", "FirstName"] => ["FirstName", "Last-Name"]
        .join(" ") // ["FirstName", "Last-Name"] => "FirstName Last-Name"
        .split(/\s|-/g) // "FirstName Last-Name" => ["FirstName", "Last", "Name"]
        .map(name => name[0]?.toUpperCase()) // ["FirstName", "Last", "Name"] => ["F", "L", "N"]
        .join("") ?? <BsPersonCircle size="95%" /> // ["F", "L", "N"] => "FLN"
    }
  />
)

export default UserAvatar
