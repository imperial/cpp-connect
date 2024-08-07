import DisplayOnlyIfAdmin from "@/components/rbac/DisplayOnlyIfAdmin"

import { AddCompany } from "./AddCompany"
import styles from "./company-admin-actions.module.scss"

import { PlusIcon } from "@radix-ui/react-icons"
import { Button, Card, Flex, Heading, Text } from "@radix-ui/themes"
import React from "react"

export const CompanyAdminActions = () => {
  return (
    <DisplayOnlyIfAdmin>
      <Card variant="surface">
        <Flex gap="3" direction="row" align="center" justify="between" p="2">
          <Heading size="6">Admin Actions</Heading>
          <Flex gap="3" direction="row" align="center">
            <AddCompany />
          </Flex>
        </Flex>
      </Card>
    </DisplayOnlyIfAdmin>
  )
}
