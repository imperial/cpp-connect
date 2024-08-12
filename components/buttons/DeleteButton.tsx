import styles from "./danger-button.module.scss"

import { Button, Text } from "@radix-ui/themes"
import React from "react"
import { FaTrash } from "react-icons/fa"

type DeleteButtonProps = {
  text: string
} & React.ComponentProps<typeof Button>

export const DeleteButton: React.FC<DeleteButtonProps> = props => {
  return (
    <Button color="red" {...props}>
      <FaTrash />
      <Text>{props.text}</Text>
    </Button>
  )
}
