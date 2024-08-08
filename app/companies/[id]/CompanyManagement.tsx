"use client"

import TanstackTable from "@/components/TanstackTable"

import styles from "./company-management.module.scss"

import { User } from "@prisma/client"
import { Box, Button, Card, Flex, Heading, Text } from "@radix-ui/themes"
import { createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"
import React from "react"
import { FaTrash } from "react-icons/fa"

type UsersTableRow = Pick<User, "id" | "createdAt" | "email">

const users: UsersTableRow[] = [
  {
    id: "1",
    createdAt: new Date(),
    email: "illia@gmail.com",
  },
  {
    id: "2",
    createdAt: new Date(),
    email: "matthew@gmail.com",
  },
  {
    id: "3",
    createdAt: new Date(),
    email: "kishan@gmail.com",
  },
]

const columnHelper = createColumnHelper<UsersTableRow>()

const columns = [
  columnHelper.accessor("email", {
    cell: info => info.getValue(),
    header: "Email",
    id: "email",
  }),
  columnHelper.accessor("createdAt", {
    cell: info => format(info.getValue(), "MMMM eo yyyy"),
    header: "Added",
    id: "createdAt",
  }),
  columnHelper.display({
    cell: () => (
      <Button color="red" variant="outline">
        <FaTrash />
        <Text>Delete</Text>
      </Button>
    ),
    header: "Actions",
    id: "actions",
    enableSorting: false,
  }),
]

export const CompanyManagement = () => {
  return (
    <Card className={styles.companyManagerCard}>
      <Flex direction="column" gap="3" p="4">
        <Heading size="6">Company Management</Heading>
        <Box pl="9" pr="9">
          <TanstackTable data={users} columns={columns} enablePagination={false} enableSearch={false} />
        </Box>
      </Flex>
    </Card>
  )
}
