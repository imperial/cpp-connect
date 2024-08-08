"use client"

import { AddUser } from "@/app/companies/[id]/AddUser"
import TanstackTable from "@/components/TanstackTable"

import UsersTable, { UsersTableRow } from "./UsersTable"
import styles from "./company-management.module.scss"

import { CompanyProfile, User } from "@prisma/client"
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes"
import React from "react"

export const CompanyManagement = ({ company }: { company: CompanyProfile & { companyUsers?: UsersTableRow[] } }) => {
  return (
    <Card className={styles.companyManagerCard}>
      <Flex direction="column" gap="3" p="4">
        <Flex gap="3" direction="row" align="center" justify="between">
          <Heading size="6">Company Management</Heading>
          <AddUser company={company} />
        </Flex>

        <Box pl="9" pr="9">
          <UsersTable users={company.companyUsers} />
        </Box>
      </Flex>
    </Card>
  )
}
