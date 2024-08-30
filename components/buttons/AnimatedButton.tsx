import styles from "./animated-button.module.scss"

import { Button } from "@radix-ui/themes"
import React from "react"

type AnimatedButtonProps = React.ComponentProps<typeof Button>

export const AnimatedButton: React.FC<AnimatedButtonProps> = props => (
  <Button {...props} className={(props?.className || "") + " " + styles.animatedButton}>
    {props.children}
  </Button>
)
