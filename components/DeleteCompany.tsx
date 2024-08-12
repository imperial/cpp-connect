"use client"

import { deleteCompany } from "@/lib/crud/companies"
import { FormPassBackState } from "@/lib/types"

import { SevereWarningCallout } from "./Callouts"
import { DeleteButton } from "./buttons/DeleteButton"
import styles from "./deletecompany.module.scss"
import { FormInModal } from "./forms/FormInModal"
import { DangerModalContent } from "./modals/DangerModalContent"
import { GenericFormModal } from "./modals/GenericFormModal"

import { Button, Dialog, Spinner, Text, TextField } from "@radix-ui/themes"
import { useCallback, useState } from "react"

interface DeleteCompanyFormProps {
  close: () => void
  name: string
  id: number
}

const DeleteCompanyForm = ({ close, name, id }: DeleteCompanyFormProps) => {
  const deleteCompanyWithName = async (prevState: FormPassBackState, formData: FormData) =>
    deleteCompany(prevState, formData, name, id)

  return (
    <FormInModal
      action={deleteCompanyWithName}
      close={close}
      submitButton={(_, isSubmitting) => {
        return (
          <Button type="submit" color="red" className={styles.dangerButton}>
            {isSubmitting ? <Spinner /> : "Delete"}
          </Button>
        )
      }}
    >
      <SevereWarningCallout message="This action is irreversible." />
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Enter the company name to confirm ({name}):
        </Text>
        <TextField.Root name="name" placeholder={name} required />
      </label>
    </FormInModal>
  )
}

export const DeleteCompany = ({ name, id }: { name: string; id: number }) => {
  const formRenderer = useCallback(
    ({ close }: { close: () => void }) => <DeleteCompanyForm close={close} name={name} id={id} />,
    [name, id],
  )

  return (
    <GenericFormModal
      title={`Delete company, ${name}?`}
      description="Are you sure you want to delete this company?"
      form={formRenderer}
    >
      <DeleteButton text="Delete Company" size="3" className={styles.dangerButton} />
    </GenericFormModal>
  )
}
