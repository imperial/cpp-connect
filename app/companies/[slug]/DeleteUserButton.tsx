"use client"

import { ErrorCallout } from "@/components/Callouts"
import { DeleteButton } from "@/components/buttons/DeleteButton"
import { DangerModalContent } from "@/components/modals/DangerModalContent"
import { deleteUser } from "@/lib/crud/users"

import { User } from "@prisma/client"
import { Button, Dialog, Flex, Spinner } from "@radix-ui/themes"
import { signOut, useSession } from "next-auth/react"
import React, { useState, useTransition } from "react"

export const DeleteUserButton = ({ user }: { user: Pick<User, "id" | "email"> }) => {
  const { data: session } = useSession()
  const [openState, setOpenState] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [serverMessage, setServerMessage] = useState("")

  const handleDelete = async () => {
    startTransition(async () => {
      const { status, message } = await deleteUser(user.id, window.location.pathname)
      if (status === "success") {
        if (user.id === session?.user.id) {
          await signOut({ callbackUrl: "/" })
        }
        setOpenState(false)
      } else {
        setServerMessage(message || "Server error")
      }
    })
  }

  return (
    <Dialog.Root open={openState} onOpenChange={setOpenState} defaultOpen={false}>
      <Dialog.Trigger>
        <DeleteButton text="Delete" title={`Delete user ${user.email}`} />
      </Dialog.Trigger>
      <DangerModalContent>
        <Dialog.Title>Are you sure?</Dialog.Title>
        <Flex gap="4" direction="column">
          {serverMessage && <ErrorCallout message={serverMessage} />}
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
      </DangerModalContent>
    </Dialog.Root>
  )
}
