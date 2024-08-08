"use client"

import { FormPassBackState, updateCompany } from "@/lib/crud/companies"

import { CompanyProfile } from "@prisma/client"
import { CrossCircledIcon, ExclamationTriangleIcon, PlusIcon } from "@radix-ui/react-icons"
import { Button, Callout, Dialog, Flex, Spinner, Text, TextField } from "@radix-ui/themes"
import React, { use, useCallback, useEffect, useState } from "react"
import { useFormState } from "react-dom"

const EditCompanyForm = ({
  setOpenState,
  prevCompanyProfile,
}: {
  setOpenState: (v: boolean) => void
  prevCompanyProfile: CompanyProfile
}) => {
  const updateCompanyWithID = (prevState: FormPassBackState, formData: FormData) =>
    updateCompany(prevState, formData, prevCompanyProfile.id)
  const [formState, formAction] = useFormState(updateCompanyWithID, { message: "" })
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
            <ExclamationTriangleIcon />
          </Callout.Icon>
          <Callout.Text>You can add company users & other details after this step.</Callout.Text>
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
            Company Summary
          </Text>
          <TextField.Root
            name="summary"
            placeholder="lorem ipsum..."
            required
            defaultValue={prevCompanyProfile.summary}
          />
        </label>
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

export const EditCompany = ({ prevCompanyProfile }: { prevCompanyProfile: CompanyProfile }) => {
  const [openState, setOpenState] = useState(false)

  return (
    <Dialog.Root open={openState} onOpenChange={setOpenState} defaultOpen={true}>
      <Dialog.Trigger>
        <Button size="3">
          <PlusIcon />
          <Text>Edit Company Profile Details</Text>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="60vw">
        <Dialog.Title>Edit company</Dialog.Title>

        <EditCompanyForm setOpenState={setOpenState} prevCompanyProfile={prevCompanyProfile} />
      </Dialog.Content>
    </Dialog.Root>
  )
}
