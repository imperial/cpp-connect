/**
 * Callouts we use in the app
 */
import { CheckCircledIcon, CrossCircledIcon, ExclamationTriangleIcon, InfoCircledIcon } from "@radix-ui/react-icons"
import { Callout } from "@radix-ui/themes"
import React, { ComponentProps } from "react"

export const BaseCallout: React.FC<
  {
    message: string
    icon: React.ReactNode
    color: ComponentProps<typeof Callout.Root>["color"]
  } & Callout.RootProps
> = ({ message, icon, color, ...props }) => (
  <Callout.Root {...props} color={color}>
    <Callout.Icon>{icon}</Callout.Icon>
    <Callout.Text>{message}</Callout.Text>
  </Callout.Root>
)

export const InfoCallout: React.FC<{ message: string } & Callout.RootProps> = ({ message, ...props }) => (
  <BaseCallout message={message} icon={<InfoCircledIcon />} color={undefined} {...props} />
)

export const ErrorCallout: React.FC<{ message: string } & Callout.RootProps> = ({ message, ...props }) => (
  <BaseCallout message={message} icon={<CrossCircledIcon />} color="red" {...props} />
)

export const WarningCallout: React.FC<{ message: string } & Callout.RootProps> = ({ message, ...props }) => (
  <BaseCallout message={message} icon={<ExclamationTriangleIcon />} color="yellow" {...props} />
)

export const SevereWarningCallout: React.FC<{ message: string } & Callout.RootProps> = ({ message, ...props }) => (
  <BaseCallout message={message} icon={<ExclamationTriangleIcon />} color="red" {...props} />
)

export const SuccessCallout: React.FC<{ message: string } & Callout.RootProps> = ({ message, ...props }) => (
  <BaseCallout message={message} icon={<CheckCircledIcon />} color="green" {...props} />
)
