"use client"

import UserAvatar from "@/components/UserAvatar"
import styles from "@/components/profileDropdown.module.scss"

import { Button, Flex, Heading, Link, Text } from "@radix-ui/themes"
import { Session } from "next-auth"
import { signOut } from "next-auth/react"
import React from "react"
import { BsBoxArrowRight } from "react-icons/bs"

export const DropdownCard = ({ user, shortcode }: { user: Session["user"]; shortcode: string }) => {
  return (
    <Flex className={styles.DropdownCard} gap="3">
      <UserAvatar user={user} size="6" />
      <Flex direction="column">
        <Heading>{user.name}</Heading>
        <Button asChild>
          <Link href={`/students/${shortcode}`}>Profile</Link>
        </Button>
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
