/**
 * Callouts we use in the app
 */
import { InfoCircledIcon } from "@radix-ui/react-icons"
import { Callout } from "@radix-ui/themes"
import React from "react"

export const InfoCallout: React.FC<{ message: string }> = ({ message }) => (
  <Callout.Root>
    <Callout.Icon>
      <InfoCircledIcon />
    </Callout.Icon>
    <Callout.Text>{message}</Callout.Text>
  </Callout.Root>
)

export const ErrorCallout: React.FC<{ message: string }> = ({ message }) => (
  <Callout.Root color="red">
    <Callout.Icon>
      <InfoCircledIcon />
    </Callout.Icon>
    <Callout.Text>{message}</Callout.Text>
  </Callout.Root>
)
