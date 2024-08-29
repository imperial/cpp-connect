"use client"

import TanstackTable from "@/components/TanstackTable"

import { DeleteUserButton } from "./DeleteUserButton"

import { User } from "@prisma/client"
import { createColumnHelper } from "@tanstack/react-table"
import { format } from "date-fns"
import React from "react"

export type UsersTableRow = Pick<User, "id" | "createdAt" | "email">

const columnHelper = createColumnHelper<UsersTableRow>()

const columns = [
  columnHelper.accessor("email", {
    cell: info => info.getValue(),
    header: "Email",
    id: "email",
  }),
  columnHelper.accessor("createdAt", {
    cell: info => format(info.getValue(), "MMMM do yyyy"),
    header: "Added",
    id: "createdAt",
  }),
  columnHelper.display({
    cell: info => <DeleteUserButton user={info.row.original} />,
    header: "Actions",
    id: "actions",
    enableSorting: false,
  }),
]
const UsersTable = ({ users = [] }: { users?: UsersTableRow[] }) => {
  return <TanstackTable data={users} columns={columns} enablePagination={false} enableSearch={false} />
}

export default UsersTable
