"use client"

import { deleteEvent } from "@/lib/crud/events"
import { FormPassBackState } from "@/lib/types"

import { SevereWarningCallout } from "./Callouts"
import styles from "./deletecompany.module.scss"
import { FormInModal } from "./forms/FormInModal"
import { GenericFormModal } from "./modals/GenericFormModal"

import { Button, IconButton, Spinner, Text, TextField } from "@radix-ui/themes"
import { useCallback } from "react"
import { FaTrash } from "react-icons/fa"

interface DeleteEventFormProps {
  close: () => void
  companyID: number
  id: number
  redirectOnDelete?: boolean
}

const DeleteEventForm = ({ close, companyID, id, redirectOnDelete = false }: DeleteEventFormProps) => {
  const deleteEventWithId = async (prevState: FormPassBackState, formData: FormData) =>
    deleteEvent(prevState, formData, companyID, id, redirectOnDelete)

  return (
    <FormInModal
      action={deleteEventWithId}
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

export const DeleteEvent = ({
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
      <DeleteEventForm close={close} id={id} companyID={companyID} redirectOnDelete={redirectOnDelete} />
    ),
    [id, companyID, redirectOnDelete],
  )

  return (
    <GenericFormModal
      title="Delete event"
      description="Are you sure you want to delete this event?"
      form={formRenderer}
    >
      <IconButton size="3" color="red">
        <FaTrash color="white" />
      </IconButton>
    </GenericFormModal>
  )
}
