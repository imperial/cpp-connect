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
  onSuccess?: (formState: FormPassBackState) => void
  submitButton?: (formState: FormPassBackState, isSubmitting: boolean) => React.ReactNode
}

export const FormWithAction: React.FC<FormWithActionProps> = ({
  action,
  children,
  defaultState,
  actionsSection,
  onSuccess,
  submitButton,
}) => {
  const [isPending, startTransition] = useTransition()
  const wrappedAction = useCallback(
    (prevState: FormPassBackState, formData: FormData): Promise<FormPassBackState> => {
      return new Promise(async (resolve, reject) => {
        startTransition(async () => {
          try {
            const res = await action(prevState, formData)
            if (res.status === "success") {
              onSuccess?.(res)
            }
            resolve(res)
          } catch (e) {
            reject(e)
          }
        })
      })
    },
    [action, onSuccess],
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
        {submitButton?.(formState, isPending) ?? <Button type="submit">{isPending ? <Spinner /> : "Save"}</Button>}
      </Flex>
    </form>
  )
}

interface FormInModalProps extends FormWithActionProps {
  close: () => void
}

export const FormInModal: React.FC<FormInModalProps> = props => {
  const AdditionalButtons = (
    <>
      {props.actionsSection}
      <Button
        variant="soft"
        color="gray"
        onClick={e => {
          e.preventDefault()
          props.close?.()
        }}
      >
        Cancel
      </Button>
    </>
  )
  return (
    <FormWithAction onSuccess={() => close()} {...props} actionsSection={AdditionalButtons}>
      {props.children}
    </FormWithAction>
  )
}
