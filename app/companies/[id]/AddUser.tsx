"use client"

import { createCompanyUser } from "@/lib/crud/companies"

import { CompanyProfile } from "@prisma/client"
import { CrossCircledIcon, ExclamationTriangleIcon, InfoCircledIcon, PlusIcon } from "@radix-ui/react-icons"
import { Button, Callout, Dialog, Flex, Spinner, Text, TextField } from "@radix-ui/themes"
import React, { use, useCallback, useEffect, useState } from "react"
import { useFormState } from "react-dom"

const AddUserForm = ({ setOpenState, companyId }: { setOpenState: (v: boolean) => void; companyId: number }) => {
  const [formState, formAction] = useFormState(createCompanyUser, { message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (formState?.status === "success") {
      setOpenState(false)
    }
    setIsSubmitting(false)
  }, [formState, setOpenState])

  const clientSideSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true)
  }, [])

  return (
    <form onSubmit={clientSideSubmit} action={formAction}>
      <Flex direction="column" gap="3">
        <Callout.Root>
          <Callout.Icon>
            <InfoCircledIcon />
          </Callout.Icon>
          <Callout.Text>We will give you a link for them to sign in with.</Callout.Text>
        </Callout.Root>
        {formState?.status === "error" && formState?.message && (
          <Callout.Root color="red">
            <Callout.Icon>
              <CrossCircledIcon />
            </Callout.Icon>
            <Callout.Text>{formState.message}</Callout.Text>
          </Callout.Root>
        )}
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            User email
          </Text>
          <TextField.Root name="email" placeholder="E.g., user@company.com" required type="email" />
        </label>
        <TextField.Root name="companyId" defaultValue={companyId} required hidden />
      </Flex>
      <Flex gap="3" mt="4" justify="end">
        <Button
          variant="soft"
          color="gray"
          onClick={e => {
            e.preventDefault()
            setOpenState(false)
          }}
        >
          Cancel
        </Button>
        <Button type="submit">{isSubmitting ? <Spinner /> : "Save"}</Button>
      </Flex>
    </form>
  )
}

export const AddUser = ({ company }: { company: CompanyProfile }) => {
  const [openState, setOpenState] = useState(false)

  return (
    <Dialog.Root open={openState} onOpenChange={setOpenState} defaultOpen={false}>
      <Dialog.Trigger>
        <Button size="3">
          <PlusIcon />
          <Text>Add User</Text>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="40vw">
        <Dialog.Title>Add new user</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Add a new user to {company.name}
        </Dialog.Description>

        <AddUserForm setOpenState={setOpenState} companyId={company.id} />
      </Dialog.Content>
    </Dialog.Root>
  )
}
