import styles from "./danger-modal-content.module.scss"

import { Dialog } from "@radix-ui/themes"
import React from "react"

/**
 * A modal with a red outline - wraps Dialog.Content
 */
export const DangerModalContent = ({ children }: { children: React.ReactNode }) => {
  return <Dialog.Content className={styles.redDialog}>{children}</Dialog.Content>
}
