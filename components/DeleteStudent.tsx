"use client"

import { deleteStudent } from "@/lib/crud/students"
import { FormPassBackState } from "@/lib/types"

import { SevereWarningCallout } from "./Callouts"
import { DeleteButton } from "./buttons/DeleteButton"
import styles from "./deleteStudent.module.scss"
import { FormInModal } from "./forms/FormInModal"
import { GenericFormModal } from "./modals/GenericFormModal"

import * as Accordion from "@radix-ui/react-accordion"
import { Box, Button, ChevronDownIcon, Flex, Heading, Spinner, Text, TextField } from "@radix-ui/themes"
import { signOut } from "next-auth/react"
import { useCallback } from "react"

interface DeleteStudentFormProps {
  close: () => void
  id: string
}

const DeleteStudentForm = ({ close, id }: DeleteStudentFormProps) => {
  const deleteStudentWithName = async (prevState: FormPassBackState, formData: FormData) => {
    const res = await deleteStudent(prevState, formData, id)

    if (res.status === "success") {
      await signOut({ callbackUrl: "/" })
    }

    return res
  }

  return (
    <FormInModal
      action={deleteStudentWithName}
      close={close}
      submitButton={(_, isSubmitting) => {
        return (
          <Button type="submit" color="red" style={{ color: "white" }}>
            {isSubmitting ? <Spinner /> : "Delete"}
          </Button>
        )
      }}
    >
      <SevereWarningCallout message="This action is irreversible." />
      <label>
        <Text as="div" size="2" mb="1" weight="bold">
          Enter your shortcode to confirm deletion
        </Text>
        <TextField.Root name="confirmationText" placeholder="e.g. ab1223" required />
      </label>
    </FormInModal>
  )
}

const DeleteStudent = ({ id }: { id: string }) => {
  const formRenderer = useCallback(
    ({ close }: { close: () => void }) => <DeleteStudentForm close={close} id={id} />,
    [id],
  )

  return (
    <GenericFormModal
      title={`Delete Profile?`}
      description="Are you sure you want to delete your profile?"
      form={formRenderer}
    >
      <DeleteButton text="Delete Account" size="3" />
    </GenericFormModal>
  )
}

export const DangerZone = ({ id }: { id: string }) => {
  return (
    <Box mt="5">
      <Accordion.Root type="single" collapsible>
        <Accordion.Item value="item-1">
          <Accordion.Trigger className={styles.AccordionTrigger}>
            <Flex align="center" gap="2">
              <ChevronDownIcon className={styles.AccordionChevron} aria-hidden />
              <Heading>Danger Zone</Heading>
            </Flex>
          </Accordion.Trigger>
          <Accordion.Content className={styles.AccordionContent}>
            <Flex direction="column" p="3" gap="3">
              <Text>
                This will permanently delete your account and all of its data. You will not be able to reactivate this
                account.
              </Text>
              <DeleteStudent id={id} />
            </Flex>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion.Root>
    </Box>
  )
}
