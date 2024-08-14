"use client"

import { ErrorCallout, InfoCallout, SuccessCallout } from "@/components/Callouts"
import { PlusButton } from "@/components/buttons/PlusButton"
import { FormInModal } from "@/components/forms/FormInModal"
import { GenericFormModal } from "@/components/modals/GenericFormModal"
import { createCompanyUser } from "@/lib/crud/companies"

import styles from "./add-user.module.scss"

import { CompanyProfile } from "@prisma/client"
import { CopyIcon } from "@radix-ui/react-icons"
import { Button, IconButton, Spinner, Strong, Text, TextField, Tooltip } from "@radix-ui/themes"
import React, { useCallback, useState } from "react"

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

const AddUserForm = ({ close, companyId }: { close: () => void; companyId: number }) => {
  const [formReturn, setFormReturn] = useState<Awaited<ReturnType<typeof createCompanyUser>> | undefined>(undefined)

  return (
    <FormInModal
      action={createCompanyUser}
      onSuccess={formState => {
        setFormReturn(formState)
      }}
      close={close}
      submitButton={(formState, isSubmitting) =>
        formState?.status === "success" ? (
          <Button onClick={close}>Close</Button>
        ) : (
          <Button type="submit">{isSubmitting ? <Spinner /> : "Save"}</Button>
        )
      }
    >
      {formReturn ? (
        <UserSignUpSuccess signInURL={formReturn.signInURL} />
      ) : (
        <>
          <InfoCallout message="We will give you a link for them to sign in with." />
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
    </FormInModal>
  )
}

export const AddUser = ({ company }: { company: CompanyProfile }) => {
  const formRenderer = useCallback(
    ({ close }: { close: () => void }) => <AddUserForm close={close} companyId={company.id} />,
    [company.id],
  )

  return (
    <GenericFormModal title="Add new user" description={`Add a new user to ${company.name}`} form={formRenderer}>
      <PlusButton>
        <Text>Add User</Text>
      </PlusButton>
    </GenericFormModal>
  )
}
