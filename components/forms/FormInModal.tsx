import { FormWithAction, FormWithActionProps } from "./FormWithAction"

import { Button } from "@radix-ui/themes"

export interface FormInModalProps extends FormWithActionProps {
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
    <FormWithAction onSuccess={() => props?.close()} {...props} actionsSection={AdditionalButtons}>
      {props.children}
    </FormWithAction>
  )
}
