"use client"

import { deleteCompany } from "@/lib/crud/companies"
import { FormPassBackState } from "@/lib/types"

import { SevereWarningCallout } from "./Callouts"
import { DeleteButton } from "./DeleteButton"
import styles from "./deletecompany.module.scss"
import { FormInModal } from "./forms/FormInModal"

import { Button, Dialog, Spinner, Text, TextField } from "@radix-ui/themes"
import { useState } from "react"

interface DeleteCompanyFormProps {
  setOpenState: (v: boolean) => void
  name: string
  id: number
}

const DeleteCompanyForm = ({ setOpenState, name, id }: DeleteCompanyFormProps) => {
  const deleteCompanyWithName = async (prevState: FormPassBackState, formData: FormData) =>
    deleteCompany(prevState, formData, name, id)

  return (
    <FormInModal
      action={deleteCompanyWithName}
      close={() => setOpenState(false)}
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
  const [openState, setOpenState] = useState(false)

  return (
    <Dialog.Root open={openState} onOpenChange={setOpenState} defaultOpen={false}>
      <Dialog.Trigger>
        <DeleteButton text="Delete Company" size="3" className={styles.dangerButton} />
      </Dialog.Trigger>
      <Dialog.Content className="deleteDialog">
        <Dialog.Title>Delete company, {name}?</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Are you sure you want to delete this company?
        </Dialog.Description>

        <DeleteCompanyForm setOpenState={setOpenState} name={name} id={id} />
      </Dialog.Content>
    </Dialog.Root>
  )
}
