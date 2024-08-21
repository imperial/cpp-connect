"use client"

import { Dropdown } from "@/components/Dropdown"
import { PlusButton } from "@/components/buttons/PlusButton"
import { FormInModal } from "@/components/forms/FormInModal"
import { GenericFormModal } from "@/components/modals/GenericFormModal"
import { createOpportunity, updateOpportunity } from "@/lib/crud/opportunities"
import { FormPassBackState } from "@/lib/types"

import { Opportunity, OpportunityType } from "@prisma/client"
import { Pencil1Icon } from "@radix-ui/react-icons"
import { Card, IconButton, Text, TextField } from "@radix-ui/themes"
import dynamic from "next/dynamic"
import { useState } from "react"

const defaultOpportunityType = OpportunityType.Internship

const MdEditor = dynamic(() => import("@/components/MdEditor"), { ssr: false })

const UpsertOpportunityForm = ({
  close,
  prevOpportunity,
  companyID,
}: {
  close: () => void
  prevOpportunity?: Opportunity
  companyID?: number
}) => {
  const [opportunityType, setOpportunityType] = useState<OpportunityType>(
    prevOpportunity?.type ?? defaultOpportunityType,
  )
  const [description, setDescription] = useState(prevOpportunity?.description ?? "")
  const createOpportunityWithArgs = async (prevState: FormPassBackState, formData: FormData) =>
    createOpportunity(prevState, formData, companyID ?? -1)

  const updateOpportunityWithArgs = async (prevState: FormPassBackState, formData: FormData) =>
    updateOpportunity(prevState, formData, companyID ?? -1, prevOpportunity?.id ?? -1)

  return (
    <FormInModal action={prevOpportunity ? updateOpportunityWithArgs : createOpportunityWithArgs} close={close}>
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
        <input type="hidden" readOnly name="type" value={opportunityType} />
      </label>
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Description*
        </Text>
        <Card>
          <MdEditor markdown={description} onChange={setDescription} />
        </Card>
        <input type="hidden" readOnly name="description" value={description} />
      </label>
    </FormInModal>
  )
}

const UpsertOpportunity = ({
  children,
  prevOpportunity,
  companyID,
}: {
  children: React.ReactNode
  prevOpportunity?: Opportunity
  companyID: number
}) => {
  const formRenderer = ({ close }: { close: () => void }) => (
    <UpsertOpportunityForm close={close} prevOpportunity={prevOpportunity} companyID={companyID} />
  )

  return (
    <GenericFormModal
      title={prevOpportunity ? "Update opportunity" : "Add new opportunity"}
      description={prevOpportunity ? "Update opportunity details" : "Add a new opportunity listing"}
      form={formRenderer}
    >
      {children}
    </GenericFormModal>
  )
}

export const AddOpportunity = ({ companyID }: { companyID: number }) => {
  return (
    <UpsertOpportunity companyID={companyID}>
      <PlusButton>
        <Text>Opportunity</Text>
      </PlusButton>
    </UpsertOpportunity>
  )
}

export const EditOpportunity = ({
  companyID,
  prevOpportunity,
}: {
  companyID: number
  prevOpportunity: Opportunity
}) => {
  return (
    <UpsertOpportunity companyID={companyID} prevOpportunity={prevOpportunity}>
      <IconButton size="3">
        <Pencil1Icon />
      </IconButton>
    </UpsertOpportunity>
  )
}
