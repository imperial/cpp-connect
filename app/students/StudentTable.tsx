"use client"

import TanstackTable from "@/components/TanstackTable"

import { StudentProfile, User } from "@prisma/client"
import { createColumnHelper } from "@tanstack/react-table"
import { formatDistanceToNowStrict } from "date-fns"

type StudentRow = {
  user: Pick<User, "name" | "updatedAt">
} & Pick<StudentProfile, "graduationDate" | "course">

const columnHelper = createColumnHelper<StudentRow>()

const columns = [
  columnHelper.accessor("user.name", {
    cell: info => info.getValue(),
    header: "Name",
    id: "name",
    sortingFn: "text",
  }),
  columnHelper.accessor("graduationDate", {
    cell: info => info.getValue()?.getFullYear() ?? "N/A",
    header: "Graduating",
    sortingFn: "datetime",
  }),
  columnHelper.accessor("course", {
    cell: info => info.getValue(),
    header: "Course",
    sortingFn: "text",
  }),
  columnHelper.accessor("user.updatedAt", {
    cell: info => (
      <time suppressHydrationWarning={true}>{formatDistanceToNowStrict(info.getValue(), { addSuffix: true })} </time>
    ),
    header: "Last Updated",
    sortingFn: "datetime",
  }),
]

const StudentTable = ({ students }: { students: StudentRow[] }) => {
  return <TanstackTable data={students} columns={columns} />
}

export default StudentTable
