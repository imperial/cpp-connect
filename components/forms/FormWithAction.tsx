import { FormPassBackState, ServerSideFormHandler } from "@/lib/types"

import { ErrorCallout } from "../Callouts"
import { Button, Flex, Spinner } from "@radix-ui/themes"
import React, { useCallback, useTransition } from "react"
import { useFormState } from "react-dom"

interface FormWithActionProps {
  action: ServerSideFormHandler
  children: React.ReactNode
  defaultState?: FormPassBackState
  actionsSection?: React.ReactNode
}

export const FormWithAction: React.FC<FormWithActionProps> = ({ action, children, defaultState, actionsSection }) => {
  const [isPending, startTransition] = useTransition()
  const wrappedAction = useCallback(
    (prevState: FormPassBackState, formData: FormData): Promise<FormPassBackState> => {
      return new Promise(async (resolve, reject) => {
        startTransition(async () => {
          try {
            const res = await action(prevState, formData)
            resolve(res)
          } catch (e) {
            reject(e)
          }
        })
      })
    },
    [action],
  )
  const [formState, formAction] = useFormState(wrappedAction, defaultState ?? { message: "" })

  return (
    <form action={formAction}>
      <Flex direction="column" gap="3">
        {formState?.status === "error" && formState?.message && <ErrorCallout message={formState.message} />}
        {children}
      </Flex>
      <Flex gap="3" mt="4" justify="end">
        {actionsSection}
        <Button type="submit">{isPending ? <Spinner /> : "Save"}</Button>
      </Flex>
    </form>
  )
}

interface FormInModalProps extends FormWithActionProps {
  close: () => void
}

export const FormInModal: React.FC<FormInModalProps> = ({ action, children, defaultState, actionsSection, close }) => {
  const AdditionalButtons = (
    <>
      {actionsSection}
      <Button
        variant="soft"
        color="gray"
        onClick={e => {
          e.preventDefault()
          close()
        }}
      >
        Cancel
      </Button>
    </>
  )

  const wrappedAction: ServerSideFormHandler = useCallback(
    async (prevState, formData) => {
      const res = await action(prevState, formData)

      if (res.status === "success") {
        close()
      }
      return res
    },
    [action, close],
  )
  return (
    <FormWithAction action={wrappedAction} defaultState={defaultState} actionsSection={AdditionalButtons}>
      {children}
    </FormWithAction>
  )
}
