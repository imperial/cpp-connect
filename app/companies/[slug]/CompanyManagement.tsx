import { AddUser } from "@/app/companies/[slug]/AddUser"
import { DeleteCompany } from "@/components/DeleteCompany"
import RestrictedAreaCompany from "@/components/rbac/RestrictedAreaCompany"

import UsersTable, { UsersTableRow } from "./UsersTable"
import styles from "./company-management.module.scss"

import { CompanyProfile } from "@prisma/client"
import { Box, Card, Flex, Heading } from "@radix-ui/themes"
import React from "react"

export const CompanyManagement = ({ company }: { company: CompanyProfile & { companyUsers?: UsersTableRow[] } }) => {
  return (
    <RestrictedAreaCompany companyId={company.id} showMessage={false}>
      <Card className={styles.companyManagerCard}>
        <Flex direction="column" gap="3" p="4">
          <Flex gap="3" direction="row" align="center" justify="between" wrap={"wrap"}>
            <Heading size="6">Company Management</Heading>
            <Flex gap="2" wrap="wrap">
              <AddUser key={company.id} company={company} />
              <DeleteCompany name={company.name} id={company.id} />
            </Flex>
          </Flex>

          <Box className={styles.addUsersWrapper}>
            <UsersTable users={company.companyUsers} />
          </Box>
        </Flex>
      </Card>
    </RestrictedAreaCompany>
  )
}
