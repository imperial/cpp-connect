import { ExclamationTriangleIcon, PlusIcon } from "@radix-ui/react-icons"
import { Button, Callout, Dialog, Flex, Text, TextField } from "@radix-ui/themes"
import React from "react"

export const AddCompany = () => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button size="3">
          <PlusIcon />
          <Text>Add Company</Text>
        </Button>
      </Dialog.Trigger>
      <Dialog.Content maxWidth="60vw">
        <Dialog.Title>Add new company</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Add a new company profile
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <Callout.Root>
            <Callout.Icon>
              <ExclamationTriangleIcon />
            </Callout.Icon>
            <Callout.Text>You can add company users & other details after this step.</Callout.Text>
          </Callout.Root>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Name
            </Text>
            <TextField.Root defaultValue="Freja Johnsen" placeholder="Enter your full name" />
          </label>
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Email
            </Text>
            <TextField.Root defaultValue="freja@example.com" placeholder="Enter your email" />
          </label>
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close>
            <Button>Save</Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
