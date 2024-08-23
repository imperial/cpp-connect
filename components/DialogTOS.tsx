"use client"

import MdViewer from "./MdViewer"

import { Button, Dialog, Flex, Text } from "@radix-ui/themes"
import React, { useEffect, useState } from "react"

const DialogTOS = ({ accept }: { accept: () => void }) => {
  const [openState, setOpenState] = useState(false)
  const [tosText, setTosText] = useState<string>()

  useEffect(() => {
    fetch("/tos.txt")
      .then(res => res.text())
      .then(text => setTosText(text))
      .catch(e => console.error(e))
  }, [])

  return (
    <Dialog.Root open={openState} onOpenChange={setOpenState} defaultOpen={false}>
      <Dialog.Trigger>
        <Button type="button">Save</Button>
      </Dialog.Trigger>
      <Dialog.Content style={{ minWidth: "60vw" }}>
        <Dialog.Title>Terms & Conditions</Dialog.Title>
        {typeof tosText !== "undefined" && <MdViewer markdown={tosText} />}
        <Flex justify="end" gap="3" pt="3">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button onClick={accept} disabled={typeof tosText === "undefined"}>
              Accept
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default DialogTOS
