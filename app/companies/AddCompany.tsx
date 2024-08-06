import AdminOnlyArea from "@/components/rbac/AdminOnlyArea"

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

        <AdminOnlyArea>
          <Flex direction="column" gap="3">
            <Callout.Root>
              <Callout.Icon>
                <ExclamationTriangleIcon />
              </Callout.Icon>
              <Callout.Text>You can add company users & other details after this step.</Callout.Text>
            </Callout.Root>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Company name
              </Text>
              <TextField.Root placeholder="E.g., Imperial" />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Website
              </Text>
              <TextField.Root placeholder="E.g., https://imperial.ic.ac.uk" />
            </label>
            <label>
              <Text as="div" size="2" mb="1" weight="bold">
                Sector
              </Text>
              <TextField.Root placeholder="E.g., Education" />
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
        </AdminOnlyArea>
      </Dialog.Content>
    </Dialog.Root>
  )
}
