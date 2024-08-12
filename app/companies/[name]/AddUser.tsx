"use client"

import { ErrorCallout, InfoCallout, SuccessCallout } from "@/components/Callouts"
import { createCompanyUser } from "@/lib/crud/companies"

import styles from "./add-user.module.scss"

import { CompanyProfile } from "@prisma/client"
import { CheckCircledIcon, CopyIcon, CrossCircledIcon, InfoCircledIcon, PlusIcon } from "@radix-ui/react-icons"
import { Button, Callout, Dialog, Flex, IconButton, Spinner, Strong, Text, TextField, Tooltip } from "@radix-ui/themes"
import React, { useCallback, useEffect, useState } from "react"
import { useFormState } from "react-dom"

const UserSignUpSuccess: React.FC<{ signInURL?: string }> = ({ signInURL }) => {
  const [toolTipOpen, setToolTipOpen] = useState(false)
  const copyPasteLink: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    e => {
      e.preventDefault()
      e.stopPropagation()

      // Copy to clipboard
      if (signInURL) navigator.clipboard.writeText(signInURL)

      // Show tooltip
      setToolTipOpen(true)

      // Hide tooltip after 2 seconds
      setTimeout(() => setToolTipOpen(false), 2000)
    },
    [signInURL],
  )
  return (
    <>
      {signInURL ? (
        <SuccessCallout message="User successfully created! Copy and send them their sign-in link below." />
      ) : (
        <ErrorCallout message="Server did not generate a sign-in link. Please try again later." />
      )}

      {signInURL && (
        <Strong>
          <TextField.Root value={signInURL} className={styles.boldInput} readOnly>
            <TextField.Slot />
            <TextField.Slot>
              <Tooltip content="Copied to clipboard!" open={toolTipOpen} defaultOpen={false}>
                <IconButton variant="ghost" onClick={copyPasteLink}>
                  <CopyIcon />
                </IconButton>
              </Tooltip>
            </TextField.Slot>
          </TextField.Root>
        </Strong>
      )}
    </>
  )
}

const AddUserForm = ({ setOpenState, companyId }: { setOpenState: (v: boolean) => void; companyId: number }) => {
  const [formState, formAction] = useFormState(createCompanyUser, { message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setIsSubmitting(false)
  }, [formState, setOpenState])

  const clientSideSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true)
  }, [])

  return (
    <form onSubmit={clientSideSubmit} action={formAction}>
      <Flex direction="column" gap="3">
        {formState?.status === "success" ? (
          <UserSignUpSuccess signInURL={formState.signInURL} />
        ) : (
          <>
            <InfoCallout message="We will give you a link for them to sign in with." />
            {formState?.status === "error" && formState?.message && <ErrorCallout message={formState.message} />}
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                User email
              </Text>
              <TextField.Root name="email" placeholder="E.g., user@company.com" required type="email" />
            </label>
            <input name="companyId" value={companyId} required type="hidden" readOnly />
            <input name="baseUrl" value={window.location.origin} required type="hidden" readOnly />
          </>
        )}
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
        {formState?.status === "success" ? (
          <Button onClick={() => setOpenState(false)}>Close</Button>
        ) : (
          <Button type="submit">{isSubmitting ? <Spinner /> : "Save"}</Button>
        )}
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
      <Dialog.Content>
        <Dialog.Title>Add new user</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Add a new user to {company.name}
        </Dialog.Description>

        <AddUserForm setOpenState={setOpenState} companyId={company.id} />
      </Dialog.Content>
    </Dialog.Root>
  )
}
