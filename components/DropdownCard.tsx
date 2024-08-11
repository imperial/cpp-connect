"use client"

import UserAvatar from "@/components/UserAvatar"
import styles from "@/components/profileDropdown.module.scss"

import { Button, Flex, Heading, Text } from "@radix-ui/themes"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import React from "react"
import { BsBoxArrowRight } from "react-icons/bs"

export const DropdownCard = ({ user, children }: { user: Session["user"]; children?: React.ReactNode }) => {
  return (
    <Flex className={styles.DropdownCard} gap="3">
      <UserAvatar user={user} size="6" />
      <Flex direction="column">
        <Heading>{user.name}</Heading>
        {children}
        <Button color="red" onClick={() => signOut()} style={{ color: "white" }}>
          <Flex gap="2" align="center">
            <Text>Sign out</Text>
            <BsBoxArrowRight />
          </Flex>
        </Button>
      </Flex>
    </Flex>
  )
}
