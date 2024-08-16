"use client"

import { deleteOpportunity } from "@/lib/crud/opportunities"
import { FormPassBackState } from "@/lib/types"

import { SevereWarningCallout } from "./Callouts"
import styles from "./deletecompany.module.scss"
import { FormInModal } from "./forms/FormInModal"
import { GenericFormModal } from "./modals/GenericFormModal"

import { Button, IconButton, Spinner, Text, TextField } from "@radix-ui/themes"
import { useCallback } from "react"
import { FaTrash } from "react-icons/fa"

interface DeleteOpportunityFormProps {
  close: () => void
  companyID: number
  id: number
  redirectOnDelete?: boolean
}

const DeleteOpportunityForm = ({ close, companyID, id, redirectOnDelete = false }: DeleteOpportunityFormProps) => {
  const deleteOpportunityWithId = async (prevState: FormPassBackState, formData: FormData) =>
    deleteOpportunity(prevState, formData, companyID, id, redirectOnDelete)

  return (
    <FormInModal
      action={deleteOpportunityWithId}
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
    </FormInModal>
  )
}

export const DeleteOpportunity = ({
  id,
  companyID,
  redirectOnDelete = false,
}: {
  id: number
  companyID: number
  redirectOnDelete?: boolean
}) => {
  const formRenderer = useCallback(
    ({ close }: { close: () => void }) => (
      <DeleteOpportunityForm close={close} id={id} companyID={companyID} redirectOnDelete={redirectOnDelete} />
    ),
    [id, companyID],
  )

  return (
    <GenericFormModal
      title="Delete opportunity"
      description="Are you sure you want to delete this opportunity?"
      form={formRenderer}
    >
      <IconButton size="3" color="red">
        <FaTrash color="white" />
      </IconButton>
    </GenericFormModal>
  )
}
