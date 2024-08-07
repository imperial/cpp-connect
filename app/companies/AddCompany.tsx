"use client"

import { createCompany } from "@/lib/crud/companies"

import { CrossCircledIcon, ExclamationTriangleIcon, PlusIcon } from "@radix-ui/react-icons"
import { Button, Callout, Dialog, Flex, Spinner, Text, TextField } from "@radix-ui/themes"
import React, { use, useCallback, useEffect, useState } from "react"
import { useFormState } from "react-dom"

const AddCompanyForm = ({ setOpenState }: { setOpenState: (v: boolean) => void }) => {
  const [formState, formAction] = useFormState(createCompany, { message: "" })
  const [isSubmitting, setisSubmitting] = useState(false)

  useEffect(() => {
    if (formState?.status === "success") {
      setOpenState(false)
    }
    setisSubmitting(false)
  }, [formState, setOpenState])

  const clientSideSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    setisSubmitting(true)
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
            Company name
          </Text>
          <TextField.Root name="name" placeholder="E.g., Imperial" required />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Website
          </Text>
          <TextField.Root name="website" placeholder="E.g., https://imperial.ic.ac.uk" required type="url" />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Sector
          </Text>
          <TextField.Root name="sector" placeholder="E.g., Education" required />
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

export const AddCompany = () => {
  const [openState, setopenState] = useState(false)

  return (
    <Dialog.Root open={openState} onOpenChange={setopenState} defaultOpen={false}>
      <Dialog.Trigger>
        <Button size="3">
          <PlusIcon />
          <Text>Add Company</Text>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="60vw">
        <Dialog.Title>Add new company</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Add a new company profile
        </Dialog.Description>

        <AddCompanyForm setOpenState={setopenState} />
      </Dialog.Content>
    </Dialog.Root>
  )
}
