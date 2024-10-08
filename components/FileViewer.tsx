"use client"

import Link from "@/components/Link"

import styles from "./fileViewer.module.scss"

import { Button, Dialog, Flex } from "@radix-ui/themes"
import Image from "next/image"
import React, { ReactNode, useEffect, useState } from "react"
import { BsDownload, BsXCircle } from "react-icons/bs"

/**
 * A modal to view a file.
 * @param fileUrl The URL of the file to view.
 * @param title The title of the file.
 * @param children The trigger for the modal.
 */
export const FileViewer = ({ fileUrl, title, children }: { fileUrl: string; title: string; children: ReactNode }) => {
  const [openState, setOpenState] = useState(false)

  const [isImage, setIsImage] = useState(fileUrl.match(/\.(jpeg|jpg|gif|png|svg)$/))

  useEffect(() => {
    // fetch the file to determine if it's an image
    if (!isImage && fileUrl.startsWith("blob")) {
      fetch(fileUrl)
        .then(response => response.blob())
        .then(blob => {
          setIsImage(blob.type.match(/^image\//))
        })
    }
  }, [fileUrl, isImage])

  const close = () => setOpenState(false)
  return (
    <Dialog.Root open={openState} onOpenChange={setOpenState} defaultOpen={false}>
      <Dialog.Trigger>{children}</Dialog.Trigger>

      <Dialog.Content className={styles.container} maxWidth="auto">
        <Dialog.Title size="8" className={styles.title}>
          {title}
        </Dialog.Title>

        <Flex direction="column" className={styles.content} gap="4">
          {isImage ? (
            <Image src={fileUrl} alt={title} className={styles.image} width={0} height={0} unoptimized />
          ) : (
            <iframe src={fileUrl} title={title} className={styles.iframe} />
          )}

          <Flex className={styles.buttons} justify="end" gap="4">
            <Button asChild>
              <Link href={fileUrl} target="_blank" download radixProps={{ underline: "none" }}>
                <BsDownload />
                Download
              </Link>
            </Button>

            <Button onClick={close} color="red" style={{ color: "white" }}>
              <BsXCircle />
              Close
            </Button>
          </Flex>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
