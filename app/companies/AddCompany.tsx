"use client"

import { InfoCallout } from "@/components/Callouts"
import { PlusButton } from "@/components/buttons/PlusButton"
import { FormInModal } from "@/components/forms/FormInModal"
import { GenericFormModal } from "@/components/modals/GenericFormModal"
import { createCompany } from "@/lib/crud/companies"

import { PlusIcon } from "@radix-ui/react-icons"
import { Button, Dialog, Text, TextField } from "@radix-ui/themes"
import { useState } from "react"

const AddCompanyForm = ({ close }: { close: () => void }) => {
  return (
    <FormInModal action={createCompany} close={close}>
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
  return (
    <GenericFormModal title="Add new company" description="Add a new company profile" form={AddCompanyForm}>
      <PlusButton>
        <Text>Add Company</Text>
      </PlusButton>
    </GenericFormModal>
  )
}
