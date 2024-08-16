import styles from "./animated-button.module.scss"

import { Button } from "@radix-ui/themes"
import React from "react"

type AnimatedButtonProps = React.ComponentProps<typeof Button>

export const AnimatedButton: React.FC<AnimatedButtonProps> = props => {
  return (
    <Button className={styles.animatedButton} {...props}>
      {props.children}
    </Button>
  )
}
