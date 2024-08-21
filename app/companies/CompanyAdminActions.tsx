import RestrictedArea from "@/components/rbac/RestrictedArea"

import { AddCompany } from "./AddCompany"

import { Card, Flex, Heading } from "@radix-ui/themes"
import React from "react"

export const CompanyAdminActions = () => {
  return (
    <RestrictedArea showMessage={false}>
      <Card style={{ width: "100%" }} variant="surface">
        <Flex gap="3" direction="row" align="center" justify="between" p="2">
          <Heading size="6">Admin Actions</Heading>
          <Flex gap="3" direction="row" align="center">
            <AddCompany />
          </Flex>
        </Flex>
      </Card>
    </RestrictedArea>
  )
}
