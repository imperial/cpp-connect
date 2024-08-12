import { FormWithAction, FormWithActionProps } from "./FormWithAction"

import { Button } from "@radix-ui/themes"

export interface FormInModalProps extends FormWithActionProps {
  close: () => void
}

/**
 * A version of {@link FormWithAction} that is designed to be used in modals.
 *
 * Specifically, it adds a cancel button to the form that will call the `close` prop when clicked, and sets a default `onSuccess` handler to close the modal.
 *
 * Prop overrides notes:
 * 1. The defalt `onSuccess` handler will call the `close` prop when the form is successfully submitted, however it can be overridden completely by passing a new `onSuccess` prop.
 * 	However note that this new handler will then be responsible for closing the form
 * 2. Additional `actionsSection`s will be displayed to the left of the close button
 *
 * @see FormInModalProps for details on the props.
 * @see FormWithActionProps for details on the props.
 */
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
    <FormWithAction onSuccess={() => props?.close()} {...props} actionsSection={AdditionalButtons}>
      {props.children}
    </FormWithAction>
  )
}
