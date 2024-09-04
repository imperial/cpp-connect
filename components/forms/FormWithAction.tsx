"use client"

import { FormPassBackState, ServerSideFormHandler } from "@/lib/types"

import { ErrorCallout } from "../Callouts"
import { Button, Flex, Spinner } from "@radix-ui/themes"
import React, { useCallback, useTransition } from "react"
import { useFormState } from "react-dom"

export interface FormWithActionProps {
  /** The server-side action to be called when the form is submitted. Must conform to the `ServerSideFormHandler` type. */
  action: ServerSideFormHandler<FormPassBackState, []>
  /** The form fields to be displayed. */
  children: React.ReactNode
  /** The default state of the form, depending on what your form actions returns. Defaults to `{ message: "" }`. */
  defaultState?: FormPassBackState
  /** Additional actions to be displayed to the right of the submit button. Defaults to `null`. */
  actionsSection?: React.ReactNode
  /** A callback function to be called when the form action returns a `status` of "success". */
  onSuccess?: (formState: FormPassBackState) => void
  /**
   * A custom submit button to be displayed. Defaults to a button with the text "Save" and a spinner when submitting.
   *  This is a function in case you wish to display a different button based on the form state or other conditions.
   */
  submitButton?: (formState: FormPassBackState, isSubmitting: boolean) => React.ReactNode
}

/**
 * The scaffold that should be used with every form that requires a server-side action.
 *
 * It displays a flexbox form with submit/actions button aligned to the form end on the right.
 *
 * It displays a form with a submit button that will call the `action` prop when clicked.
 *
 * Additionally, the default submit button displays a spinner when the form is submitting through the use of `useTransition`.
 *
 * Children will be wrapped in a Radix flexbox, set to vertical. Use Radix inputs where possible for the children.
 *
 * @see FormWithActionProps for details on the props.
 * @see FormInModal for a version of this form for us in modals.
 */
export function FormWithAction({
  action,
  children,
  defaultState,
  actionsSection,
  onSuccess,
  submitButton,
}: FormWithActionProps) {
  const [isPending, startTransition] = useTransition()
  const wrappedAction = useCallback(
    (prevState: FormPassBackState, formData: FormData): Promise<FormPassBackState> => {
      return new Promise(async (resolve, _reject) => {
        startTransition(async () => {
          try {
            const res = await action(prevState, formData)
            if (res.status === "success") {
              onSuccess?.(res)
            }
            resolve(res)
          } catch (e: any) {
            resolve({
              status: "error",
              message: `An unexpected error occurred: ${e.message}. This may be related to the nginx configuration. Please contact us if this error persists.`,
            })
          }
        })
      })
    },
    [action, onSuccess],
  )
  const [formState, formAction] = useFormState(
    wrappedAction,
    defaultState ?? ({ status: "error", message: "" } as FormPassBackState),
  )

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
