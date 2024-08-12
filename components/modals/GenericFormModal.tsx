"use client"

import { Dialog } from "@radix-ui/themes"
import React, { useState } from "react"

interface GenericFormModalProps {
  /** Children here should be the trigger for the modal */
  children: React.ReactNode
  title: string | React.ReactNode
  description: string | React.ReactNode
  /** A form should accept a function to close a modal so it can close the modal on submit. You should probably wrap this in a useCallback() before passing it to us. */
  form: React.FC<{ close: () => void }>
}

/**
 * A generic modal for modal that are just some sort of form
 *
 */
export const GenericFormModal: React.FC<GenericFormModalProps> = ({ children, title, description, form: Form }) => {
  const [openState, setOpenState] = useState(false)

  const close = () => setOpenState(false)
  return (
    <Dialog.Root open={openState} onOpenChange={setOpenState} defaultOpen={false}>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content maxWidth="60vw">
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          {description}
        </Dialog.Description>
        <Form close={close} />
      </Dialog.Content>
    </Dialog.Root>
  )
}
