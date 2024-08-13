"use client"

import { InfoCallout } from "@/components/Callouts"
import { PlusButton } from "@/components/buttons/PlusButton"
import { FormInModal } from "@/components/forms/FormInModal"
import { GenericFormModal } from "@/components/modals/GenericFormModal"
import { createCompany } from "@/lib/crud/companies"

import { SLUG_START, slugComputer } from "./slug"

import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Flex, Text, TextField, Tooltip } from "@radix-ui/themes"
import { useState } from "react"

const AddCompanyForm = ({ close }: { close: () => void }) => {
  const [companyName, setCompanyName] = useState("")
  const [slug, setSlug] = useState(companyName.toLowerCase().replace(/\s/g, "-"))

  return (
    <FormInModal action={createCompany} close={close}>
      <InfoCallout message="You can add company users & other details after this step." />
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Company name*
        </Text>
        <TextField.Root
          name="name"
          placeholder="E.g., Imperial"
          required
          value={companyName}
          onChange={e => {
            setCompanyName(e.target.value)
            setSlug(slugComputer(e.target.value))
          }}
        />
      </label>
      <label>
        <Flex direction="row" align="center" gap="1">
          <Text as="div" size="2" mb="1" weight="bold">
            Slug*
          </Text>
          <Tooltip content="Used to access the company in the URL. Must be unique.">
            <InfoCircledIcon style={{ marginBottom: "3px" }} />
          </Tooltip>
        </Flex>
        <Flex direction="row" gap="1" align="center">
          <Text>{SLUG_START}</Text>
          <TextField.Root name="slug" required value={slug} onChange={e => setSlug(e.target.value)} />
        </Flex>
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
