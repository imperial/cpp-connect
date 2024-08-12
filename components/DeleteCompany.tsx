"use client"

import { deleteCompany } from "@/lib/crud/companies"
import { FormPassBackState } from "@/lib/types"

import { ErrorCallout, SevereWarningCallout, WarningCallout } from "./Callouts"
import styles from "./deletecompany.module.scss"

import { CrossCircledIcon, ExclamationTriangleIcon } from "@radix-ui/react-icons"
import { Button, Callout, Dialog, Flex, Spinner, Text, TextField } from "@radix-ui/themes"
import React, { useCallback, useEffect, useState } from "react"
import { useFormState } from "react-dom"
import { FaTrash } from "react-icons/fa"

interface DeleteCompanyFormProps {
  setOpenState: (v: boolean) => void
  name: string
  id: number
}

const DeleteCompanyForm = ({ setOpenState, name, id }: DeleteCompanyFormProps) => {
  const deleteCompanyWithName = async (prevState: FormPassBackState, formData: FormData) =>
    deleteCompany(prevState, formData, name, id)
  const [formState, formAction] = useFormState(deleteCompanyWithName, { message: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (formState?.status === "success") {
      setOpenState(false)
    }
    setIsSubmitting(false)
  }, [formState, setOpenState])

  const clientSideSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true)
  }, [])

  return (
    <form onSubmit={clientSideSubmit} action={formAction}>
      <Flex direction="column" gap="3">
        <SevereWarningCallout message="This action is irreversible." />
        {formState?.status === "error" && formState?.message && <ErrorCallout message={formState.message} />}
        <label>
          <Text as="div" size="2" mb="1" weight="bold">
            Enter the company name to confirm ({name}):
          </Text>
          <TextField.Root name="name" placeholder={name} required />
        </label>
      </Flex>
      <Flex gap="3" mt="4" justify="end">
        <Button
          variant="soft"
          color="gray"
          onClick={e => {
            e.preventDefault()
            setOpenState(false)
          }}
        >
          Cancel
        </Button>
        <Button type="submit" color="red" className={styles.dangerButton}>
          {isSubmitting ? <Spinner /> : "Delete"}
        </Button>
      </Flex>
    </form>
  )
}

export const DeleteCompany = ({ name, id }: { name: string; id: number }) => {
  const [openState, setOpenState] = useState(false)

  return (
    <Dialog.Root open={openState} onOpenChange={setOpenState} defaultOpen={false}>
      <Dialog.Trigger>
        <Button size="3" color="red" className={styles.dangerButton}>
          <FaTrash color="white" />
          <Text>Delete Company</Text>
        </Button>
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
