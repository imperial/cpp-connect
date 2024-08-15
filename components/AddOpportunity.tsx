"use client"

import { Dropdown } from "@/components/Dropdown"
import { PlusButton } from "@/components/buttons/PlusButton"
import { FormInModal } from "@/components/forms/FormInModal"
import { GenericFormModal } from "@/components/modals/GenericFormModal"
import { createCompany } from "@/lib/crud/companies"

import { Opportunity, OpportunityType } from "@prisma/client"
import { Pencil1Icon } from "@radix-ui/react-icons"
import { Card, IconButton, Text, TextField } from "@radix-ui/themes"
import dynamic from "next/dynamic"
import { useState } from "react"

// enum OpportunityType {
//   Internship
//   Placement
//   Graduate
// }

// model Opportunity {
//   position    String
//   location    String
//   type        OpportunityType
//   link        String
//   description String
// }

// company as an argument to action

const defaultOpportunityType = OpportunityType.Internship

const MdEditor = dynamic(() => import("@/components/MdEditor"), { ssr: false })

const AddOpportunityForm = ({ close, prevOpportunity }: { close: () => void; prevOpportunity?: Opportunity }) => {
  const [opportunityType, setOpportunityType] = useState<OpportunityType>(
    prevOpportunity?.type ?? defaultOpportunityType,
  )
  const [description, setDescription] = useState(prevOpportunity?.description ?? "")

  return (
    <FormInModal action={createCompany} close={close}>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Position*
        </Text>
        <TextField.Root
          name="position"
          placeholder="E.g., Summer Intern"
          required
          defaultValue={prevOpportunity?.position}
        />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Location*
        </Text>
        <TextField.Root name="location" placeholder="E.g., London" required defaultValue={prevOpportunity?.location} />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Link*
        </Text>
        <TextField.Root
          name="link"
          placeholder="E.g., https://imperial.ic.ac.uk/opportunity"
          required
          type="url"
          defaultValue={prevOpportunity?.link}
        />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Type*
        </Text>
        <Dropdown
          defaultValue={opportunityType}
          items={(Object.keys(OpportunityType) as Array<keyof typeof OpportunityType>).map(key => ({
            item: key,
            value: key,
          }))}
          onValueChange={(type: string) => setOpportunityType(type as OpportunityType)}
        ></Dropdown>
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Description*
        </Text>
        <Card>
          <MdEditor markdown={description} onChange={setDescription} />
        </Card>
      </label>
    </FormInModal>
  )
}

export const AddOpportunity = ({ prevOpportunity }: { prevOpportunity?: Opportunity }) => {
  const formRenderer = ({ close }: { close: () => void }) => (
    <AddOpportunityForm close={close} prevOpportunity={prevOpportunity} />
  )

  return (
    <GenericFormModal
      title={prevOpportunity ? "Update opportunity" : "Add new opportunity"}
      description={prevOpportunity ? "Update opportunity details" : "Add a new opportunity listing"}
      form={formRenderer}
    >
      {prevOpportunity ? (
        <IconButton size="3" mt="3">
          <Pencil1Icon />
        </IconButton>
      ) : (
        <PlusButton>
          <Text>Add Opportunity</Text>
        </PlusButton>
      )}
    </GenericFormModal>
  )
}
