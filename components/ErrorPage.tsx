import styles from "./error.module.scss"

import { Button, Flex } from "@radix-ui/themes"
import React from "react"

export default function ErrorPage({
  children,
  title,
  message,
}: {
  children: React.ReactNode
  title: string
  message: string
}) {
  return (
    <div className={styles.container}>
      <Flex justify="center" align="center" direction="column" gap="3">
        <h1 className={styles.header}>{title}</h1>
        <h2 className={styles.message}>{message}</h2>
        {children}
      </Flex>
    </div>
  )
}
