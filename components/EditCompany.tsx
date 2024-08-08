"use client"

import { FormPassBackState, updateCompany } from "@/lib/crud/companies"

import { CompanyProfile } from "@prisma/client"
import { CrossCircledIcon, ExclamationTriangleIcon, Pencil1Icon } from "@radix-ui/react-icons"
import { Button, Callout, Dialog, Flex, IconButton, Spinner, Text, TextField } from "@radix-ui/themes"
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
            Summary
          </Text>
          <TextField.Root name="summary" placeholder="lorem ipsum..." defaultValue={prevCompanyProfile.summary} />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Website
          </Text>
          <TextField.Root
            name="website"
            placeholder="site@example.com"
            required
            defaultValue={prevCompanyProfile.website}
          />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Sector
          </Text>
          <TextField.Root
            name="sector"
            placeholder="e.g. Education"
            required
            defaultValue={prevCompanyProfile.sector}
          />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Size
          </Text>
          <TextField.Root name="size" placeholder="e.g. 100+" defaultValue={prevCompanyProfile.size ?? undefined} />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Headquarters
          </Text>
          <TextField.Root name="hq" placeholder="e.g. London" defaultValue={prevCompanyProfile.hq ?? undefined} />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Contact Email
          </Text>
          <TextField.Root
            name="email"
            placeholder="mail@company.com"
            defaultValue={prevCompanyProfile.email ?? undefined}
          />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Contact Phone
          </Text>
          <TextField.Root name="phone" placeholder="07123456789" defaultValue={prevCompanyProfile.phone ?? undefined} />
        </label>
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Founded
          </Text>
          <TextField.Root
            name="founded"
            placeholder="e.g. 1984"
            defaultValue={prevCompanyProfile.founded ?? undefined}
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
        <IconButton size="3" mt="3">
          <Pencil1Icon />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="60vw">
        <Dialog.Title>Edit company</Dialog.Title>

        <EditCompanyForm setOpenState={setOpenState} prevCompanyProfile={prevCompanyProfile} />
      </Dialog.Content>
    </Dialog.Root>
  )
}
