import { AnimatedButton } from "@/components/buttons/AnimatedButton"

import styles from "./error.module.scss"

import { Flex, Heading } from "@radix-ui/themes"
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
        <Heading as="h1" className={styles.header}>
          404
        </Heading>
        <Heading as="h2" className={styles.message}>
          {message}
        </Heading>
        <AnimatedButton asChild>
          <Link href={btnUrl}>{btnName}</Link>
        </AnimatedButton>
      </Flex>
    </div>
  )
}
