"use client"

import { updateCompany } from "@/lib/crud/companies"
import { ServerSideFormHandler } from "@/lib/types"

import { FormInModal } from "./forms/FormInModal"

import { CompanyProfile } from "@prisma/client"
import { Pencil1Icon } from "@radix-ui/react-icons"
import { Dialog, IconButton, Text, TextField } from "@radix-ui/themes"
import { useState } from "react"

const EditCompanyForm = ({
  setOpenState,
  prevCompanyProfile,
}: {
  setOpenState: (v: boolean) => void
  prevCompanyProfile: CompanyProfile
}) => {
  const updateCompanyWithID: ServerSideFormHandler = (prevState, formData) =>
    updateCompany(prevState, formData, prevCompanyProfile.id)

  return (
    <FormInModal action={updateCompanyWithID} close={() => setOpenState(false)}>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Company Name*
        </Text>
        <TextField.Root
          name="name"
          placeholder="e.g. Imperial College London"
          required
          defaultValue={prevCompanyProfile.name}
        />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Summary
        </Text>
        <TextField.Root name="summary" placeholder="lorem ipsum..." defaultValue={prevCompanyProfile.summary} />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Website*
        </Text>
        <TextField.Root
          name="website"
          placeholder="site@example.com"
          required
          defaultValue={prevCompanyProfile.website}
          type="url"
        />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Sector*
        </Text>
        <TextField.Root name="sector" placeholder="e.g. Education" required defaultValue={prevCompanyProfile.sector} />
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
        <TextField.Root name="founded" placeholder="e.g. 1984" defaultValue={prevCompanyProfile.founded ?? undefined} />
      </label>
    </FormInModal>
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
