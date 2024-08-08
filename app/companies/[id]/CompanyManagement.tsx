import styles from "./company-management.module.scss"

import { Card, Flex, Heading } from "@radix-ui/themes"
import React from "react"

export const CompanyManagement = () => {
  return (
    <Card className={styles.companyManagerCard}>
      <Flex direction="column" gap="3" p="4">
        <Heading size="6">Company Management</Heading>
      </Flex>
    </Card>
  )
}
