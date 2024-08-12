"use client"

import { InfoCallout } from "@/components/Callouts"
import { FormInModal } from "@/components/forms/FormInModal"
import { createCompany } from "@/lib/crud/companies"

import { PlusIcon } from "@radix-ui/react-icons"
import { Button, Dialog, Text, TextField } from "@radix-ui/themes"
import { useState } from "react"

const AddCompanyForm = ({ setOpenState }: { setOpenState: (v: boolean) => void }) => {
  return (
    <FormInModal action={createCompany} close={() => setOpenState(false)}>
      <InfoCallout message="You can add company users & other details after this step." />
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Company name*
        </Text>
        <TextField.Root name="name" placeholder="E.g., Imperial" required />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Website*
        </Text>
        <TextField.Root name="website" placeholder="E.g., https://imperial.ic.ac.uk" required type="url" />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Sector*
        </Text>
        <TextField.Root name="sector" placeholder="E.g., Education" required />
      </label>
    </FormInModal>
  )
}

export const AddCompany = () => {
  const [openState, setOpenState] = useState(false)

  return (
    <Dialog.Root open={openState} onOpenChange={setOpenState} defaultOpen={false}>
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

        <AddCompanyForm setOpenState={setOpenState} />
      </Dialog.Content>
    </Dialog.Root>
  )
}
