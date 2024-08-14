import styles from "./not-found.module.scss"

import { Button, Flex } from "@radix-ui/themes"
import Link from "next/link"
import React from "react"

export default function NotFoundPage({
  message,
  btnName,
  btnUrl,
}: {
  message: string
  btnName: string
  btnUrl: string
}) {
  return (
    <div className={styles.container}>
      <Flex justify="center" align="center" direction="column" gap="3">
        <h1 className={styles.header}>404</h1>
        <h2 className={styles.message}>{message}</h2>
        <Button className={styles.backButton} asChild>
          <Link href={btnUrl}>{btnName}</Link>
        </Button>
      </Flex>
    </div>
  )
}
