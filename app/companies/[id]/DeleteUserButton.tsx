"use client"

import { deleteUser } from "@/lib/crud/users"

import styles from "./delete-user.module.scss"

import { User } from "@prisma/client"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import { Button, Callout, Dialog, Flex, Spinner, Text } from "@radix-ui/themes"
import { useSession } from "next-auth/react"
import React, { useState, useTransition } from "react"
import { FaTrash } from "react-icons/fa"

export const DeleteUserButton = ({ user }: { user: Pick<User, "id" | "email"> }) => {
  const [openState, setOpenState] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [serverMessage, setServerMessage] = useState("")

  const { data: session } = useSession()

  const handleDelete = async () => {
    startTransition(async () => {
      const { status, message } = await deleteUser(user.id, window.location.pathname)
      if (status === "success") {
        setOpenState(false)
      } else {
        setServerMessage(message || "Server error")
      }
    })
  }

  return (
    <Dialog.Root open={openState} onOpenChange={setOpenState} defaultOpen={false}>
      <Dialog.Trigger>
        <Button
          color="red"
          variant="outline"
          disabled={session?.user.id === user.id}
          title={
            session?.user.id === user.id
              ? "You can't delete yourself - contact the admins for help."
              : `Delete user ${user.email}`
          }
        >
          <FaTrash />
          <Text>Delete</Text>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="40vw" className={styles.deleteDialog}>
        <Dialog.Title>Are you sure?</Dialog.Title>
        <Flex gap="4" direction="column">
          {serverMessage && (
            <Callout.Root color="red">
              <Callout.Icon>
                <CrossCircledIcon />
              </Callout.Icon>
              <Callout.Text>{serverMessage}</Callout.Text>
            </Callout.Root>
          )}
          <Dialog.Description size="2" mb="4">
            This action can not be undone - delete user with email <strong>{user.email}</strong>?
          </Dialog.Description>
        </Flex>
        <Flex gap="3" mt="4" justify="end">
          <Button
            variant="soft"
            color="gray"
            onClick={e => {
              e.preventDefault()
              setServerMessage("")
              setOpenState(false)
            }}
          >
            Cancel
          </Button>
          <Button color="red" style={{ color: "white" }} onClick={handleDelete}>
            {isPending ? <Spinner /> : serverMessage ? "Retry" : "Delete User"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
