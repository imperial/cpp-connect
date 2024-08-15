import styles from "./error.module.scss"

import { Flex, Heading } from "@radix-ui/themes"
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
        <Heading as="h1" className={styles.header}>
          {title}
        </Heading>
        <Heading as="h2" className={styles.message}>
          {message}
        </Heading>
        {children}
      </Flex>
    </div>
  )
}
