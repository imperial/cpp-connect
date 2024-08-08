"use client"

import TanstackTable from "@/components/TanstackTable"

import { User } from "@prisma/client"
import { Button, Text } from "@radix-ui/themes"
import { createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"
import React from "react"
import { FaTrash } from "react-icons/fa"

export type UsersTableRow = Pick<User, "id" | "createdAt" | "email">

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
const UsersTable = ({ users = [] }: { users?: UsersTableRow[] }) => {
  return <TanstackTable data={users} columns={columns} enablePagination={false} enableSearch={false} />
}

export default UsersTable
