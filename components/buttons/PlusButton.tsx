import { PlusIcon } from "@radix-ui/react-icons"
import { Button, Text } from "@radix-ui/themes"
import React, { ComponentProps } from "react"

/**
 * NOTE: Default size is 3 as this is normally used as an "add" button
 */
export const PlusButton = (props: ComponentProps<typeof Button>) => {
  return (
    <Button size="3" {...props}>
      <PlusIcon />
      {props.children}
    </Button>
  )
}
