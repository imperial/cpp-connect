"use client"

import UserAvatar from "@/components/UserAvatar"
import styles from "@/components/dropdownCard.module.scss"

import { Button, Flex, Heading, Text } from "@radix-ui/themes"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import React from "react"
import { BsBoxArrowRight } from "react-icons/bs"

export const DropdownCard = ({ user, children }: { user: Session["user"]; children?: React.ReactNode }) => {
  return (
    <Flex className={styles.DropdownCard} gap="4" align="stretch">
      <Flex align="center">
        <UserAvatar user={user} size="6" />
      </Flex>
      <Flex direction="column" gap="2" justify="between">
        <Heading>{user.name || user.email}</Heading>
        {children}
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
